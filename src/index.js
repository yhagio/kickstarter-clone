import express from 'express';
const app = express();
import path from 'path';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import formidable from 'formidable';
import fs from 'fs';
import flash from 'connect-flash';

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

let projects = [
  { name: 'Hello', id: 1},
  { name: 'Hola', id: 2},
  { name: 'Bonjour', id: 3},
  { name: 'Bon dia', id: 4},
  { name: 'Konnichiwa', id: 5}
];

let project = {
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


// Home
app.route('/')
  .get((req, res) => {
    res.render('home');
  });

// Project Lit
app.route('/projects')
  .get((req, res) => {
    res.render('projects/project-list', {projects: projects});
  });

// Project Detail
app.route('/projects/:id')
  .get((req, res) => {
    res.render('projects/project-page', {project: project, id: req.params.id});
  });

// Create Project Page
app.route('/create-project')
  .get((req, res) => {
    res.render('projects/project-create');
  })
  .post((req, res) => {

    // create an incoming form object
    const form = new formidable.IncomingForm();

    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {
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
    form.uploadDir = path.join(__dirname, '../uploads')

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name and if no file, unlink
    form.on('file', (field, file) => {
      // console.log('FILE', file);
      if (file.size > 0) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
      } else {
        fs.unlink(file.path);
      }
    });

    // once all the files have been uploaded,
    // send a response to the client
    form.on('end', () => {
      if (!formObject.file_name) {
        req.flash('error', 'Cover photo is missing!');
        return res.redirect('/create-project');
      }

      // TODO: Save the project (formObject) in database

      req.flash('success','Success!');
      return res.redirect('/');
    });

    // log any errors that occur
    form.on('error', (err) => {
      console.log('An error has occured: \n' + err);
    });

  });

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at 192.168.33.10:${PORT}`) );
