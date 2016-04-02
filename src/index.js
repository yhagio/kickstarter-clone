import express from 'express';
const app = express();
import path from 'path';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';

app.set('views', path.join(__dirname, '../views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('combined'));
app.use(helmet());

app.route('/')
  .get((req, res) => {
    res.render('home');
  })
  .post((req, res) => {
    console.log(req.body);
  });

let projects = [
  { name: 'Hello'},
  { name: 'Hola'},
  { name: 'Bonjour'},
  { name: 'Bon dia'},
  { name: 'Konnichiwa'}
];

app.route('/projects')
  .get((req, res) => {
    res.render('projects/project-list', {projects: projects});
  })
  .post((req, res) => {
    console.log(req.body);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Started at 192.168.33.10:${PORT}`) );
