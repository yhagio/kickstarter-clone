import path from 'path';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.cloud_name ,
  api_key: config.api_key,
  api_secret: config.api_secret
});

const projects = [
  { name: 'Hello', id: 1},
  { name: 'Hola', id: 2},
  { name: 'Bonjour', id: 3},
  { name: 'Bon dia', id: 4},
  { name: 'Konnichiwa', id: 5}
];

const project = {
  id: 1,
  creator: {
    first_name: 'Yuichi',
    last_name: 'Hagio'
  },
  project_name: 'Aurora Project',
  short_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
  long_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  funding_goal: 15000,
  funding_end_date: new Date(),
  file_name: 'sample.jpg',
  file_path: '/vagrant/uploads/'
};

// Form objects
let formObject;

const projectHandler = {
  getProjectList(req, res) {
    return res.render(
      'projects/project-list',
      {projects: projects}
    );
  },

  getProjectPage(req, res) {
    return res.render(
      'projects/project-page',
      {project: project, id: req.params.id}
    );
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
        });

        formObject = {
          project_name: fields.project_name,
          short_description: fields.short_description,
          long_description: fields.long_description,
          funding_goal: fields.funding_goal,
          funding_end_date: fields.funding_end_date,
          file_name: files.cover_photo.name,
          file_path: files.cover_photo.path
        };

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
