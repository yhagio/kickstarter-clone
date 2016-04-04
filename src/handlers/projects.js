import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
// import { cloudinaryConfig } from '../config';
import Project from '../models/projects';
import { getDayTilEnd } from '../helpers/helpers';

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME || cloudinaryConfig.cloud_name ,
//   api_key: process.env.CLOUD_API || cloudinaryConfig.api_key,
//   api_secret: process.env.CLOUD_SECRET || cloudinaryConfig.api_secret
// });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

const projectHandler = {
  getProjectList(req, res) {
    Project.find({}).limit(20).exec((err, projects) => {
      if (err) {
        req.flash('error', 'Something went wrong. Refresh.');
        return res.redirect('/');
      }

      // TODO: dayTil()
      // TODO: progressbar percentage

      return res.render(
        'projects/project-list',
        {projects: projects}
      );
    });
  },

  getProjectPage(req, res) {
    Project.findOne({_id: req.params.id}, (err, project) => {
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

  postProjectCreate(req, res) {
    // create an incoming form object
    const form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {

      if (err) {
        console.log('Parsing error: \n', err);
      }

      if (files.cover_photo.size > 0) {
        cloudinary.uploader.upload(files.cover_photo.path, (result) => {
          console.log('Success upload: ', result);

          // files.cover_photo.name

          let newProject = new Project({
            creator: {
              first_name: 'Yuichi',
              last_name: 'Hagio'
            },
            project_name: fields.project_name,
            short_description: fields.short_description,
            long_description: fields.long_description,
            funding_goal: fields.funding_goal,
            funding_end_date: fields.funding_end_date,
            file_path: result.secure_url,
            estimated_delivery: fields.estimated_delivery,
            location: fields.location
          });

          // Save in Database
          newProject.save((err, result) => {
            if (err) {
              console.log('save err: ', err);
            } else {
              console.log('saved! ', result);
            }
          });
        });

        req.flash('success','Success!');
        return res.redirect('/');

      } else {

        req.flash('error', 'Cover photo is missing!');
        return res.redirect('/create-project');
      }

    });

    // log any errors that occur
    form.on('error', (err) => {
      console.log('An error has occured: \n' + err);
    });

  }
}

export default projectHandler;
