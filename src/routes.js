import projectHandler from './handlers/projects';

export default (app) => {
  // Home
  app.route('/')
    .get((req, res) => res.render('home'));

  // Home
  app.route('/about')
    .get((req, res) => res.render('about'));

  // Sign up
  app.route('/signup')
    .get((req, res) => res.render('authentication/signup'));

  // Log in
  app.route('/login')
    .get((req, res) => res.render('authentication/login'));

  // Forgot password
  app.route('/forgot-password')
    .get((req, res) => res.render('authentication/forgot-password'));

  // Terms of Use
  app.route('/terms-of-use')
    .get((req, res) => res.render('authentication/terms-of-use'));

  // Privacy Policy
  app.route('/privacy')
    .get((req, res) => res.render('authentication/privacy'));

  // Project Lit
  app.route('/projects')
    .get(projectHandler.getProjectList);

  // Project Detail
  app.route('/projects/:id')
    .get(projectHandler.getProjectPage);

  // Create Project Page
  app.route('/create-project')
    .get((req, res) => res.render('projects/project-create'))
    .post(projectHandler.postProjectCreate);
}
