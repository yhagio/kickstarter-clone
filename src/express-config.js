import express from 'express';
import path from 'path';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import flash from 'connect-flash';

export default (app) => {
  app.set('views', path.join(__dirname, '../views'));
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(session({
    secret: 'secret_key',
    cookie: {maxAge: 1209600000},
    resave: true,
    saveUninitialized: true
  }));
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(flash());

  // Custom flash middleware
  app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.flash;
    delete req.session.flash;
    next();
  });
}
