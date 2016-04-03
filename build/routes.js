'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _projects = require('./handlers/projects');

var _projects2 = _interopRequireDefault(_projects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
  // Home
  app.route('/').get(function (req, res) {
    res.render('home');
  });

  // Project Lit
  app.route('/projects').get(_projects2.default.getProjectList);

  // Project Detail
  app.route('/projects/:id').get(_projects2.default.getProjectPage);

  // Create Project Page
  app.route('/create-project').get(function (req, res) {
    res.render('projects/project-create');
  }).post(_projects2.default.postProjectCreate);
};