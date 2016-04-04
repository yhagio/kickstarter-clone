'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = (0, _connectMongo2.default)(_expressSession2.default);

// import { mongoConfig } from './config';

exports.default = function (app) {
  app.set('views', _path2.default.join(__dirname, '/views'));
  app.engine('handlebars', (0, _expressHandlebars2.default)({ defaultLayout: 'main' }));
  app.set('view engine', 'handlebars');
  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({ extended: false }));
  app.use(_express2.default.static('public'));
  app.use((0, _cookieParser2.default)());

  app.use((0, _expressSession2.default)({
    'secret': process.env.SESSION_SECRET, // || mongoConfig.secretKey,
    'cookie': { 'maxAge': 1209600000 },
    'store': new MongoStore({
      url: process.env.MONGOLAB_URI, // || mongoConfig.db,
      autoReconnect: true
    }),
    'resave': true,
    'saveUninitialized': true
  }));

  app.use((0, _morgan2.default)('combined'));
  app.use((0, _helmet2.default)());
  app.use((0, _connectFlash2.default)());

  // Custom flash middleware
  app.use(function (req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.flash;
    delete req.session.flash;
    next();
  });
};
