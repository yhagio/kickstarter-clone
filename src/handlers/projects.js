import cloudinary from 'cloudinary';
import formidable from 'formidable';
import Project from '../models/project';
import Reward from '../models/reward';
import { getDayTilEnd, getFundingPercentage, validateStringLength } from '../helpers/helpers';
import { prettyDate } from '../helpers/helpers';
import { 
  checkFundingGoal,
  checkFundingEndDate,
  checkEstimatedDelivery,
  checkLocation,
  checkStrLength
} from '../helpers/validations';

/***** 
  TODO: Make sure not to over publish the data
*****/



const projectHandler = {
  // Discover projects where use can choose a category to see
  // the projects
  getDiscoverPage(req, res) {
    return res.render('projects/discover');
  },

  // **** MAY BE REMOVED ****
  // General project list (No category)
  getProjectList(req, res) {
    Project.find({}).populate('createdBy', 'name').limit(20).exec((err, projects) => {
      if (err) {
        req.flash('danger', 'Something went wrong. Refresh.');
        return res.redirect('/');
      }

      projects.forEach((project) => {
        project.tilEnd = getDayTilEnd(project.funding_end_date);
        project.fundingPercentage = getFundingPercentage(project.funding_goal, project.current_funding);
      });
      
      // TODO: progressbar percentage

      return res.render(
        'projects/project-list',
        {projects: projects}
      );
    });
  },

  // Individual Project Page
  getProjectPage(req, res) {
    const populateQuery = [
      {path: 'createdBy', select: 'name'},
      { path: 'comments', 
        populate: {
          path: 'createdBy'
        },
        options: { 
          sort: { 'createdAt': -1 } 
        }
      }
    ];
    
    Project.findOne({_id: req.params.id}).populate(populateQuery).exec((err, project) => {
      if (err) {
        req.flash('danger', 'No project found.');
        return res.redirect('/');
      }
      
      // Have to return modified Project data because
      // I would like to display "delete" button for each comment list
      // if the logged in user is comment author, in order to do this,
      // add a property "isCommentAuthor" in each comment object.

      let modifiedComments = [];

      project.comments.map(function(comment) {

        let isCommentAuthor;
        // Check if the comment author is current user
        if (comment.createdBy.id === req.user.id) {
          isCommentAuthor = true;
        } else {
          isCommentAuthor = false;
        }

        modifiedComments.push({
          _id: comment._id,
          projectId: comment.projectId,
          body: comment.body,
          createdAt: prettyDate(comment.createdAt),
          createdBy: comment.createdBy,
          isCommentAuthor: isCommentAuthor
        });
      });

      let modifiedProject = {
        _id: project._id,
        createdBy: project.createdBy,
        project_name: project.project_name,
        short_description: project.short_description,
        long_description: project.long_description,
        funding_goal: project.funding_goal,
        funding_end_date: project.funding_end_date,
        file_path: project.file_path,
        current_funding: project.current_funding,
        estimated_delivery: project.estimated_delivery,
        location: project.location,
        category: project.category,
        backers: project.backers,
        comments: modifiedComments
      };
      
      return res.render(
        'projects/project-page',
        { project: modifiedProject, 
          dayTil: getDayTilEnd(project.funding_end_date)
        }
      );
    });
  },

  // Project Rewards (User can back a project)Page
  // Display the list of rewards user can choose
  getProjectRewardsPage(req, res) {
    const populateQuery = [
      { path: 'createdBy', select: 'name' },
      { path: 'rewards' }
    ];

    Project.findOne({_id: req.params.id}).populate(populateQuery).exec((err, project) => {
      if (err) {
        req.flash('danger', 'No project found.');
        return res.redirect('/');
      }

      return res.render(
        'projects/project-rewards',
        {project: project}
      );
    });
  },

  createRewards(req, res) {
    console.log('**** createRewards ***\n', req.body, req.params.id);
    // Check fields
    let errors = [];

    const checkDeliveryDateResult = checkEstimatedDelivery(req.body.estimatedDelivery);
    const checkDescResult = checkStrLength(req.body.description, 300, 'Description');

    if (req.body.rewardAmount <= 0 || isNaN(req.body.rewardAmount)) {
      errors.push('Amount should be greater then $0 and number');
    }
    if (checkDeliveryDateResult !== null) {
      errors.push(checkDeliveryDateResult);
    }
    if (checkDescResult !== null) {
      errors.push(checkDescResult);
    }

    if (errors.length > 0) {
      req.flash('danger', errors);
      return res.redirect(`/projects/${req.params.id}/rewards`);
    }

    // Save it to Reward model
    let newReward = new Reward({
      projectId: req.params.id,
      creatorId: req.user.id,
      amount: req.body.rewardAmount,
      shippingDetails: req.body.shippingDetails,
      estimatedDelivery: req.body.estimatedDelivery,
      description: req.body.description,
    });

    newReward.save((err, reward) => {
      if (err) {
        req.flash('danger', 'Could not save the reward. Try again.');
        return res.redirect(`/projects/${req.params.id}/rewards`);
      }

      console.log('**** Created reward: \n', reward);
      
      // Update the project with new rewards
      const update = { $addToSet: { rewards: reward} };

      Project.findOneAndUpdate({_id: req.params.id}, update, (error, result) => {
        if (error) {
          req.flash('danger', 'Something went wrong. Updating project failed.');
          return res.redirect(`/projects/${req.params.id}/rewards`);
        }
        req.flash('success','Reward created!');
        return res.redirect(`/projects/${req.params.id}/rewards`);
      });

    });
    
  },

  // Create a project by authorized seller
  postProjectCreate(req, res) {

    if (!req.user) {
      req.flash('danger', 'You need to login first!');
      return res.redirect('/login');
    }

    // create an incoming form object
    const form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {

      let endingDate = new Date(fields.funding_end_date);
      let deliveryDate = new Date(fields.estimated_delivery);

      if (err) {
        // console.log('Parsing error: \n', err);
        req.flash('danger', 'Failed to create your project. Try again.');
        return res.redirect('/create-project');
      }
  
      let errors = [];

      const checkProjectNameResult = validateStringLength(fields.project_name, 80, 'Project Name');
      const checkShortDescriptionResult = validateStringLength(fields.short_description, 140, 'Short Description');
      const checkLongDescriptionResult = validateStringLength(fields.long_description, 400, 'Long Description');
      const checkFundingGoalResult = checkFundingGoal(fields.funding_goal);
      const checkFundingEndDateResult = checkFundingEndDate(endingDate);
      const checkEstimatedDeliveryResult = checkEstimatedDelivery(deliveryDate);
      const checkLocationResult = checkLocation(fields.location);

      // Check fields
      // Check: project_name, short_description, long_description
      if (checkProjectNameResult !== null) {
        errors.push(checkProjectNameResult);
      }
      if (checkShortDescriptionResult !== null) {
        errors.push(checkShortDescriptionResult);
      }
      if (checkLongDescriptionResult !== null) {
        errors.push(checkLongDescriptionResult)
      }
      // Check Amount: funding_goal
      if (checkFundingGoalResult !== null) {
        errors.push(checkFundingGoalResult);
      }
      // Date check: funding_end_date, estimated_delivery
      if (checkFundingEndDateResult !== null) {
        errors.push(checkFundingEndDateResult);
      }
      if (checkEstimatedDeliveryResult !== null) {
        errors.push(checkEstimatedDeliveryResult);
      }
      // Check location
      if (checkLocationResult !== null) {
        errors.push(checkLocationResult);
      }
      // Check if it has image
      if (files.cover_photo.size === 0) {
        errors.push('Cover photo is missing!');
      }
      
      // Final check
      if (errors.length > 0) {
        req.flash('danger', errors);
        return res.redirect('/create-project');
      }

      cloudinary.uploader.upload(files.cover_photo.path, (data) => {

        let newProject = new Project({
          createdBy: req.user,
          project_name: fields.project_name,
          short_description: fields.short_description,
          long_description: fields.long_description,
          funding_goal: fields.funding_goal,
          funding_end_date: endingDate,
          file_path: data.secure_url,
          estimated_delivery: deliveryDate,
          location: fields.location
        });

        // Save in Database
        newProject.save((err, result) => {
          if (err) {
            // console.log('save err: ', err);
            req.flash('danger', 'Something went wrong, project creation failed.');
            return res.redirect('/create-project');

          } else {
            // console.log('saved! ', result);
            req.flash('success','Project created!');
            return res.redirect('/projects');
          }
        });
      });

    });

    // log any errors that occur
    form.on('error', (err) => {
      req.flash('danger', 'Failed to create project.');
      return res.redirect('/create-project');
    });

  },

  // Display the projects of a chosen category
  getProjectWithCategory(req, res) {
    Project.find({}).populate('createdBy', 'name').limit(20).exec((err, projects) => {
      if (err) {
        req.flash('danger', 'Something went wrong. Refresh.');
        return res.redirect('/projects');
      }

      projects.forEach((project) => {
        project.tilEnd = getDayTilEnd(project.funding_end_date);
        project.fundingPercentage = getFundingPercentage(project.funding_goal, project.current_funding);
      });

      return res.render(
        'projects/project-list',
        {projects: projects}
      );
    });
  }

}

export default projectHandler;
