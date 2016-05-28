'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _project = require('../models/project');

var _project2 = _interopRequireDefault(_project);

var _comment = require('../models/comment');

var _comment2 = _interopRequireDefault(_comment);

var _reward = require('../models/reward');

var _reward2 = _interopRequireDefault(_reward);

var _helpers = require('../helpers/helpers');

var _validations = require('../helpers/validations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***** 
  TODO: Make sure not to over publish the data
*****/

var projectHandler = {
  // Discover projects where use can choose a category to see
  // the projects

  getDiscoverPage: function getDiscoverPage(req, res) {
    return res.render('projects/discover');
  },


  // **** MAY BE REMOVED ****
  // General project list (No category)
  getProjectList: function getProjectList(req, res) {
    var skipNum = req.query.skipNum || 0;

    _project2.default.find({}).populate('createdBy', 'name').skip(skipNum * 20).limit(20)
    // .sort({ 'createdAt': -1 })
    .exec(function (err, projects) {
      if (err) {
        req.flash('danger', 'Something went wrong. Refresh.');
        return res.redirect('/');
      }

      projects.forEach(function (project) {
        project.tilEnd = (0, _helpers.getDayTilEnd)(project.funding_end_date);
        project.fundingPercentage = (0, _helpers.getFundingPercentage)(project.funding_goal, project.current_funding);
        project.currentFunds = Math.floor(project.current_funding / 100);
        project.isProjectActive = new Date() < project.funding_end_date;
      });

      // TODO: progressbar percentage
      if (skipNum == 0) {
        // Initial load
        return res.render('projects/project-list', { projects: projects });
      } else {
        // When user clicks "Load More" button at projects page
        return res.render('projects/project-list-more', { projects: projects,
          layout: false });
      }
    });
  },


  // Individual Project Page
  getProjectPage: function getProjectPage(req, res) {
    var commentSkipNum = req.query.commentSkipNum || 0;

    if (commentSkipNum > 0) {
      // Load more comments case
      // When user clicks "Load More" button
      _comment2.default.find({ projectId: req.params.id }).skip(commentSkipNum * 10).limit(10).exec(function (error, loadedComments) {
        if (error) {
          req.flash('danger', 'Something went wrong on loading comments.');
          return res.redirect('/projects/' + req.params.id);
        }

        return res.render('projects/project-page-more-comments', { project: loadedComments,
          layout: false
        });
      });
    } else {
      // 1st time loading the project page
      var populateQuery = [{ path: 'createdBy', select: 'name' }, { path: 'comments',
        populate: {
          path: 'createdBy'
        },
        options: {
          skip: commentSkipNum,
          limit: 10,
          sort: { 'createdAt': -1 }
        }
      }];

      _project2.default.findOne({ _id: req.params.id }).populate(populateQuery).exec(function (err, project) {
        if (err) {
          req.flash('danger', 'No project found.');
          return res.redirect('/');
        }

        // Have to return modified Project data because
        // I would like to display "delete" button for each comment list
        // if the logged in user is comment author, in order to do this,
        // add a property "isCommentAuthor" in each comment object.

        var modifiedComments = [];

        project.comments.map(function (comment) {

          var isCommentAuthor = void 0;
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
            createdAt: (0, _helpers.prettyDate)(comment.createdAt),
            createdBy: comment.createdBy,
            isCommentAuthor: isCommentAuthor
          });
        });

        var modifiedProject = {
          _id: project._id,
          createdBy: project.createdBy,
          project_name: project.project_name,
          short_description: project.short_description,
          long_description: project.long_description,
          funding_goal: project.funding_goal,
          funding_end_date: project.funding_end_date,
          file_path: project.file_path,
          current_funding: project.current_funding,
          // estimated_delivery: project.estimated_delivery,
          location: project.location,
          category: project.category,
          backerUserIds: project.backerUserIds,
          comments: modifiedComments
        };

        return res.render('projects/project-page', { project: modifiedProject,
          dayTil: (0, _helpers.getDayTilEnd)(project.funding_end_date),
          numBackers: project.backerUserIds.length,
          currentFunds: Math.floor(project.current_funding / 100),
          isProjectActive: new Date() < project.funding_end_date
        });
      });
    }
  },


  // Project Rewards (User can back a project)Page
  // Display the list of rewards user can choose
  getProjectRewardsPage: function getProjectRewardsPage(req, res) {
    var populateQuery = [{ path: 'createdBy', select: 'name' }, { path: 'rewards' }];

    _project2.default.findOne({ _id: req.params.id }).populate(populateQuery).exec(function (err, project) {
      if (err) {
        req.flash('danger', 'No project found.');
        return res.redirect('/');
      }

      if (new Date() > project.funding_end_date) {
        req.flash('danger', 'Project funding ended.');
        return res.redirect('/projects/' + req.params.id);
      }

      project.rewards.forEach(function (reward) {
        reward.numBackers = reward.backers.length;
      });

      var isCreator = false;
      if (req.user.id == project.createdBy._id) {
        isCreator = true;
      }
      return res.render('projects/project-rewards', { project: project, isCreator: isCreator });
    });
  },


  // Display create reward form for authorized creator of the project
  getRewardForm: function getRewardForm(req, res) {
    // Check if the logged-in user is the creator
    _project2.default.findOne({ _id: req.params.id, createdBy: req.user }, function (err, project) {
      if (err) {
        req.flash('danger', 'Cannot find the project.');
        return res.redirect('/projects/' + req.params.id);
      }
      if (!project) {
        req.flash('danger', 'Not authorized or cannot find the project.');
        return res.redirect('/projects/' + req.params.id);
      }
      return res.render('projects/reward-create', { project: project });
    });
  },
  getChosenRewardPage: function getChosenRewardPage(req, res) {
    _reward2.default.findById(req.params.rewardid, function (err, reward) {
      if (err) {
        req.flash('danger', 'Cannot find the reward.');
        return res.redirect('/projects/' + req.params.projectid + '/rewards');
      }
      if (!reward) {
        req.flash('danger', 'Cannot find the project reward.');
        return res.redirect('/projects/' + req.params.projectid + '/rewards');
      }
      _project2.default.findById(req.params.projectid, function (error, project) {
        if (error) {
          req.flash('danger', 'Cannot find the project.');
          return res.redirect('/projects/' + req.params.projectid + '/rewards');
        }
        return res.render('projects/project-pay-reward', { reward: reward, project: project });
      });
    });
  },


  // Create rewards & Update the project as well (3 Steps)
  createRewards: function createRewards(req, res) {
    // console.log('**** createRewards ***\n', req.body, req.params.id);
    // 1. Check fields
    var errors = [];

    var checkDeliveryDateResult = (0, _validations.checkEstimatedDelivery)(req.body.estimatedDelivery);
    var checkDescResult = (0, _validations.checkStrLength)(req.body.rewardDesc, 300, 'Description');

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
      return res.redirect('/projects/' + req.params.id + '/create-reward');
    }

    // 2. Save it to Reward model
    var newReward = new _reward2.default({
      projectId: req.params.id,
      creatorId: req.user.id,
      amount: req.body.rewardAmount,
      shippingDetails: req.body.shippingDetails,
      estimatedDelivery: req.body.estimatedDelivery,
      description: req.body.rewardDesc
    });

    // console.log('*** newReward \n', newReward);

    newReward.save(function (err, reward) {
      if (err) {
        req.flash('danger', 'Could not save the reward. Try again.');
        return res.redirect('/projects/' + req.params.id + '/create-reward');
      }

      // console.log('**** Created reward: \n', reward);

      // 3. Update the project with new rewards
      var update = { $addToSet: { rewards: reward } };

      _project2.default.findOneAndUpdate({ _id: req.params.id }, update, function (error, result) {
        if (error) {
          req.flash('danger', 'Something went wrong. Updating project failed.');
          return res.redirect('/projects/' + req.params.id + '/create-reward');
        }
        // console.log('result: ', result)
        req.flash('success', 'Reward created!');
        return res.redirect('/projects/' + req.params.id + '/create-reward');
      });
    });
  },


  // Create a project by authorized seller
  postProjectCreate: function postProjectCreate(req, res) {

    if (!req.user) {
      req.flash('danger', 'You need to login first!');
      return res.redirect('/login');
    }

    // create an incoming form object
    var form = new _formidable2.default.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, function (err, fields, files) {

      var endingDate = new Date(fields.funding_end_date);
      var deliveryDate = new Date(fields.estimated_delivery);

      if (err) {
        // console.log('Parsing error: \n', err);
        req.flash('danger', 'Failed to create your project. Try again.');
        return res.redirect('/create-project');
      }

      var errors = [];

      var checkProjectNameResult = (0, _helpers.validateStringLength)(fields.project_name, 80, 'Project Name');
      var checkShortDescriptionResult = (0, _helpers.validateStringLength)(fields.short_description, 140, 'Short Description');
      var checkLongDescriptionResult = (0, _helpers.validateStringLength)(fields.long_description, 400, 'Long Description');
      var checkFundingGoalResult = (0, _validations.checkFundingGoal)(fields.funding_goal);
      var checkFundingEndDateResult = (0, _validations.checkFundingEndDate)(endingDate);
      // const checkEstimatedDeliveryResult = checkEstimatedDelivery(deliveryDate);
      var checkLocationResult = (0, _validations.checkLocation)(fields.location);

      // Check fields
      // Check: project_name, short_description, long_description
      if (checkProjectNameResult !== null) {
        errors.push(checkProjectNameResult);
      }
      if (checkShortDescriptionResult !== null) {
        errors.push(checkShortDescriptionResult);
      }
      if (checkLongDescriptionResult !== null) {
        errors.push(checkLongDescriptionResult);
      }
      // Check Amount: funding_goal
      if (checkFundingGoalResult !== null) {
        errors.push(checkFundingGoalResult);
      }
      // Date check: funding_end_date, estimated_delivery
      if (checkFundingEndDateResult !== null) {
        errors.push(checkFundingEndDateResult);
      }
      // if (checkEstimatedDeliveryResult !== null) {
      //   errors.push(checkEstimatedDeliveryResult);
      // }
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
        console.log('Errors:', errors);
        req.flash('danger', errors);
        return res.redirect('/create-project');
      }

      _cloudinary2.default.uploader.upload(files.cover_photo.path, function (data) {

        var newProject = new _project2.default({
          createdBy: req.user,
          project_name: fields.project_name,
          short_description: fields.short_description,
          long_description: fields.long_description,
          category: fields.category,
          funding_goal: fields.funding_goal * 100,
          funding_end_date: endingDate,
          file_path: data.secure_url,
          // estimated_delivery: deliveryDate,
          location: fields.location
        });

        // Save in Database
        newProject.save(function (err, result) {
          if (err) {
            console.log('save err: ', err);
            req.flash('danger', 'Something went wrong, project creation failed.');
            return res.redirect('/create-project');
          } else {
            console.log('saved! ', result);
            req.flash('success', 'Project created!');
            return res.redirect('/projects');
          }
        });
      });
    });

    // log any errors that occur
    form.on('error', function (err) {
      req.flash('danger', 'Failed to create project.');
      return res.redirect('/create-project');
    });
  },


  // Display the projects of a chosen category
  getProjectWithCategory: function getProjectWithCategory(req, res) {
    var categoryName = req.params.name;
    var skipNum = req.query.skipNum || 0;

    _project2.default.find({ 'category': categoryName }).populate('createdBy', 'name').skip(skipNum * 20).limit(20).exec(function (err, projects) {
      if (err) {
        req.flash('danger', 'Something went wrong. Refresh.');
        return res.redirect('/projects');
      }

      projects.forEach(function (project) {
        project.tilEnd = (0, _helpers.getDayTilEnd)(project.funding_end_date);
        project.fundingPercentage = (0, _helpers.getFundingPercentage)(project.funding_goal, project.current_funding);
        project.currentFunds = Math.floor(project.current_funding / 100);
      });

      if (skipNum == 0) {
        // Initial load
        return res.render('projects/project-list', { projects: projects });
      } else {
        // When user clicks "Load More" button
        return res.render('projects/project-list-more', { projects: projects,
          layout: false });
      }
    });
  }
};

exports.default = projectHandler;