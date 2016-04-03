import projectHandler from './handlers/projects';

export default (app) => {
  // Home
  app.route('/')
    .get((req, res) => {
      res.render('home');
    });

  // Project Lit
  app.route('/projects')
    .get(projectHandler.getProjectList);

  // Project Detail
  app.route('/projects/:id')
    .get(projectHandler.getProjectPage);

  // Create Project Page
  app.route('/create-project')
    .get((req, res) => {
      res.render('projects/project-create');
    })
    .post(projectHandler.postProjectCreate);
}
