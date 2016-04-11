import express from 'express';
import path from 'path';
import compression from 'compression';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import _MongoStore from 'connect-mongo';
const MongoStore = _MongoStore(session);
import morgan from 'morgan';
import helmet from 'helmet';
import flash from 'connect-flash';
import passport from 'passport';

export default (app) => {
  app.set('views', path.join(__dirname, '../views'));
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('public'));
  app.use(cookieParser());

  app.use(session({
    'secret': process.env.SESSION_SECRET,
    'cookie': {'maxAge': 1209600000},
    'store': new MongoStore({
      url: process.env.MONGOLAB_URI,
      autoReconnect: true
    }),
    'resave': true,
    'saveUninitialized': true
  }));

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

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
  app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    if (req.session.flash) {
      res.locals.sessionFlashKey = Object.keys(req.session.flash)[0];
      res.locals.sessionFlashArray = req.session.flash[Object.keys(req.session.flash)];
    }
    res.locals.sessionFlash = req.session.flash;
    delete req.session.flash;
    next();
  });
}
