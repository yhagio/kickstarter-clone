'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();


app.set('views', _path2.default.join(__dirname, '../views'));
app.engine('handlebars', (0, _expressHandlebars2.default)({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static('public'));
app.use((0, _morgan2.default)('combined'));
app.use((0, _helmet2.default)());

app.route('/').get(function (req, res) {
  res.render('home');
}).post(function (req, res) {
  console.log(req.body);
});

var projects = [{ name: 'Hello' }, { name: 'Hola' }, { name: 'Bonjour' }, { name: 'Bon dia' }, { name: 'Konnichiwa' }];

app.route('/projects').get(function (req, res) {
  res.render('projects/project-list', { projects: projects });
}).post(function (req, res) {
  console.log(req.body);
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log('Server Started at 192.168.33.10:' + PORT);
});