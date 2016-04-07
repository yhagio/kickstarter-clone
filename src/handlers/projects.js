import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';

import Project from '../models/project';

import { getDayTilEnd, getFundingPercentage } from '../helpers/helpers';

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
        req.flash('error', 'Something went wrong. Refresh.');
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
        req.flash('error', 'No project found.');
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
        req.flash('error', 'No project found.');
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
      req.flash('error', 'You need to login first!');
      return res.redirect('/login');
    }

    // create an incoming form object
    const form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {

      if (err) {
        // console.log('Parsing error: \n', err);
        req.flash('error', 'Failed to create your project. Try again.');
        return res.redirect('/create-project');
      }

      if (files.cover_photo.size > 0) {
        cloudinary.uploader.upload(files.cover_photo.path, (result) => {

          let newProject = new Project({
            createdBy: req.user,
            project_name: fields.project_name,
            short_description: fields.short_description,
            long_description: fields.long_description,
            funding_goal: fields.funding_goal,
            funding_end_date: fields.funding_end_date,
            file_path: result.secure_url,
            estimated_delivery: fields.estimated_delivery,
            location: fields.location
          });

          // TODO: check fields

          // Save in Database
          newProject.save((err, result) => {
            if (err) {
              // console.log('save err: ', err);
              req.flash('error', 'Something went wrong, project creation failed.');
              return res.redirect('/create-project');

            } else {
              // console.log('saved! ', result);
              req.flash('success','Project created!');
              return res.redirect('/projects');
            }
          });
        });

      } else {

        req.flash('error', 'Cover photo is missing!');
        return res.redirect('/create-project');
      }

    });

    // log any errors that occur
    form.on('error', (err) => {
      // console.log('An error has occured: \n' + err);
      req.flash('error', 'Failed to create project.');
      return res.redirect('/create-project');
    });

  }
}

export default projectHandler;
