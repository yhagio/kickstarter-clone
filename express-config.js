'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectMongo = require('connect-mongo');

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);

exports.default = function (app) {
  app.set('views', _path2.default.join(__dirname, '../views'));
  app.engine('handlebars', (0, _expressHandlebars2.default)({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.use((0, _compression2.default)());
  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({ extended: false }));
  app.use(_express2.default.static('public'));
  app.use((0, _cookieParser2.default)());

  app.use((0, _expressSession2.default)({
    'secret': process.env.SESSION_SECRET,
    'cookie': { 'maxAge': 1209600000 },
    'store': new MongoStore({
      url: process.env.MONGOLAB_URI,
      autoReconnect: true
    }),
    'resave': true,
    'saveUninitialized': true
  }));

  app.use((0, _morgan2.default)('dev'));
  app.use((0, _helmet2.default)());
  app.use((0, _connectFlash2.default)());
  app.use(_passport2.default.initialize());
  app.use(_passport2.default.session());

  app.use(function (req, res, next) {
    res.locals.loggedin = req.isAuthenticated();
    next();
  });

  app.use(function (req, res, next) {
    if (req.user && req.user.stripe.access_token !== undefined) {
      res.locals.canCreateProject = true;
    } else {
      res.locals.canCreateProject = false;
    }
    next();
  });

  // Custom flash middleware
  app.use(function (req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    if (req.session.flash) {
      res.locals.sessionFlashKey = Object.keys(req.session.flash)[0];
      res.locals.sessionFlashArray = req.session.flash[Object.keys(req.session.flash)];
    }
    res.locals.sessionFlash = req.session.flash;
    delete req.session.flash;
    next();
  });
};