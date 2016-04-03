'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _config = require('../config');

var _projects = require('../models/projects');

var _projects2 = _interopRequireDefault(_projects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_cloudinary2.default.config({
  cloud_name: process.env.CLOUD_NAME || _config.cloudinaryConfig.cloud_name,
  api_key: process.env.CLOUD_API || _config.cloudinaryConfig.api_key,
  api_secret: process.env.CLOUD_SECRET || _config.cloudinaryConfig.api_secret
});

var projectHandler = {
  getProjectList: function getProjectList(req, res) {
    _projects2.default.find({}).limit(20).exec(function (err, projects) {
      if (err) {
        req.flash('error', 'Something went wrong. Refresh.');
        return res.redirect('/');
      }

      return res.render('projects/project-list', { projects: projects });
    });
  },
  getProjectPage: function getProjectPage(req, res) {
    _projects2.default.findOne({ _id: req.params.id }, function (err, project) {
      if (err) {
        req.flash('error', 'Something went wrong. Refresh.');
        return res.redirect('/');
      }

      return res.render('projects/project-page', { project: project });
    });
  },
  postProjectCreate: function postProjectCreate(req, res) {
    // create an incoming form object
    var form = new _formidable2.default.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, function (err, fields, files) {

      if (err) {
        console.log('Parsing error: \n', err);
      }

      if (files.cover_photo.size > 0) {
        _cloudinary2.default.uploader.upload(files.cover_photo.path, function (result) {
          console.log('Success upload: ', result);

          // files.cover_photo.name

          var newProject = new _projects2.default({
            creator: {
              first_name: 'Yuichi',
              last_name: 'Hagio'
            },
            project_name: fields.project_name,
            short_description: fields.short_description,
            long_description: fields.long_description,
            funding_goal: fields.funding_goal,
            funding_end_date: fields.funding_end_date,
            file_path: result.secure_url
          });

          // Save in Database
          newProject.save(function (err, result) {
            if (err) {
              console.log('save err: ', err);
            } else {
              console.log('saved! ', result);
            }
          });
        });

        req.flash('success', 'Success!');
        return res.redirect('/');
      } else {

        req.flash('error', 'Cover photo is missing!');
        return res.redirect('/create-project');
      }
    });

    // log any errors that occur
    form.on('error', function (err) {
      console.log('An error has occured: \n' + err);
    });
  }
};

function createProject(project) {}

exports.default = projectHandler;