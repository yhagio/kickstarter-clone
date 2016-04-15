import Project from '../models/project';
import { 
  getDayTilEnd,
  getFundingPercentage } from '../helpers/helpers';


const searchHandler = {
  // User needs to login to the platform to be able to back a project
  getSearchResult(req, res) {

    if (req.query.q) {
      Project.search({
        query_string: { 
          query: req.query.q
        }
      }, (err, results) => {
        if (err) {
          req.flash('danger', 'Search error. Please try again.');
          return res.redirect('/projects');
        }
        let data = results.hits.hits.map((hit) => {
          return hit;
        });
        console.log('result: \n', data);

        data.forEach((project) => {
          console.log('PROJECT: ', project);
          project._source.fundingPercentage = getFundingPercentage(project._source.funding_goal, project._source.current_funding);
        });

        res.render('projects/search-result', {
          query: req.query.q,
          data: data
        });
      });
    } else {
      return;
    }
  }

};

export default searchHandler;