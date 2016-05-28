import Project from '../models/project';
import { 
  getDayTilEnd,
  getFundingPercentage } from '../helpers/helpers';


const searchHandler = {

  postSearch(req, res) {
    // Initial search from the form does not contain "page" so assign it 1
    let page = req.body.page || 1;
    // Redirect with 2 queries (search query & page number)
    res.redirect('/search?q=' + req.body.q + '&page=' + page);
  },

  getSearchResult(req, res) {
    console.log("req.query: \n", req.query);

    // .i.e
    // per page = 5
    // P.1 = 1-5
    // P.2 = 6-10
    // P.3 = 11-15

    let page = 0;
    if (req.query.page <= 1) {
      page = 0;
    } else {
      page = req.query.page 
    }

    let perPage = 20;
    // let page = req.query.page || 0;

    let searchOptions = {
      from: perPage * page,
      size: perPage, 
      sort: { 
        'funding_end_date': 'asc'
        // 'createdAt': -1 
      }
    };

    // console.log('*** searchOptions \n', searchOptions);

    if (req.query.q) {

      Project.search(
      { // Query
        query_string: { 
          query: req.query.q
        }
      }, searchOptions, (err, results) => {
        if (err) {
          console.log('*** err: \n\n', err ,'\n');
          req.flash('danger', 'Search error. Please try again.');
          return res.redirect('/projects');
        }
        let data = results.hits.hits.map((hit) => {
          return hit;
        });

        data.forEach((project) => {
          project._source.tilEnd = getDayTilEnd(project._source.funding_end_date);
          project._source.fundingPercentage = getFundingPercentage(project._source.funding_goal, project._source.current_funding);
          project._source.currentFunds = Math.floor(project._source.current_funding / 100);
          project._source.isProjectActive = (new Date() < project._source.funding_end_date);
        });

        if (page == 0) {
          // When user searched and the initial page of the result
          return res.render('projects/search-result', {
            products: data,
            query: req.query.q
          });

        } else {
          // When user clicks "Load More" button at search result page
          return res.render('projects/search-result-more', {
            products: data,
            layout: false
          });  

        }

      });

    } else {
      return;
    }
  }

};

export default searchHandler;