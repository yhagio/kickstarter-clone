import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import Project from '../models/project';
import { getDayTilEnd, getFundingPercentage, validateStringLength } from '../helpers/helpers';
import { 
  checkFundingGoal,
  checkFundingEndDate,
  checkEstimatedDelivery,
  checkLocation
} from '../helpers/validations';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

const projectHandler = {
  getProjectList(req, res) {
    // console.log('USER: ', req.user);

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

  getProjectPage(req, res) {
    Project.findOne({_id: req.params.id}).populate('createdBy', 'name').exec((err, project) => {
      if (err) {
        req.flash('danger', 'No project found.');
        return res.redirect('/');
      }

      return res.render(
        'projects/project-page',
        {project: project, dayTil: getDayTilEnd(project.funding_end_date)}
      );
    });
  },

  // Where user back a project
  getProjectRewardsPage(req, res) {
    Project.findOne({_id: req.params.id}).populate('createdBy', 'name').exec((err, project) => {
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

  postProjectCreate(req, res) {

    if (!req.user) {
      req.flash('danger', 'You need to login first!');
      return res.redirect('/login');
    }

    // create an incoming form object
    const form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {

      console.log('fields: ', fields);

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

      console.log('Errors: ', errors);
      
      // Final check
      if (errors.length > 0) {
        req.flash('danger', errors);
        return res.redirect('/create-project');
      }

      // if (files.cover_photo.size > 0) {
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

      // } 
      // else {

      //   req.flash('danger', 'Cover photo is missing!');
      //   return res.redirect('/create-project');
      // }

    });

    // log any errors that occur
    form.on('error', (err) => {
      // console.log('An error has occured: \n' + err);
      req.flash('danger', 'Failed to create project.');
      return res.redirect('/create-project');
    });

  }
}

export default projectHandler;
