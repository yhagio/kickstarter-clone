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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projects = [{ name: 'Hello', id: 1 }, { name: 'Hola', id: 2 }, { name: 'Bonjour', id: 3 }, { name: 'Bon dia', id: 4 }, { name: 'Konnichiwa', id: 5 }];

var project = {
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
var formObject = void 0;

var projectHandler = {
  getProjectList: function getProjectList(req, res) {
    return res.render('projects/project-list', { projects: projects });
  },
  getProjectPage: function getProjectPage(req, res) {
    return res.render('projects/project-page', { project: project, id: req.params.id });
  },
  postProjectCreate: function postProjectCreate(req, res) {
    // create an incoming form object
    var form = new _formidable2.default.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, function (err, fields, files) {
      if (err) {
        console.log('Parsing error: \n', err);
      }

      formObject = {
        project_name: fields.project_name,
        short_description: fields.short_description,
        long_description: fields.long_description,
        funding_goal: fields.funding_goal,
        funding_end_date: fields.funding_end_date,
        file_name: files.cover_photo.name,
        file_path: files.cover_photo.path
      };
    });

    // store all uploads in the /uploads directory
    form.uploadDir = _path2.default.join(__dirname, '../../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name and if no file, unlink
    form.on('file', function (field, file) {
      // console.log('FILE', file);
      if (file.size > 0) {
        _fs2.default.rename(file.path, _path2.default.join(form.uploadDir, file.name));
      } else {
        _fs2.default.unlink(file.path);
      }
    });

    // once all the files have been uploaded,
    // send a response to the client
    form.on('end', function () {
      if (!formObject.file_name) {
        req.flash('error', 'Cover photo is missing!');
        return res.redirect('/create-project');
      }

      // TODO: Save the project (formObject) in database

      req.flash('success', 'Success!');
      return res.redirect('/');
    });

    // log any errors that occur
    form.on('error', function (err) {
      console.log('An error has occured: \n' + err);
    });
  }
};

exports.default = projectHandler;