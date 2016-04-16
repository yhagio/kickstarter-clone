import Project from '../models/project';
import { 
  getDayTilEnd,
  getFundingPercentage } from '../helpers/helpers';


const searchHandler = {
  // /search?q=searchQuery&page=1
  // /search?q=search
  postSearch(req, res) {
    let page = req.body.page || 1;
    console.log('PAGE ? ===>\n', page);
    res.redirect('/search?q=' + req.body.q + '&page=' + page);
  },

  getSearchResult(req, res) {
    console.log("req.query: \n", req.query);

    let perPage = 1;
    let page = req.query.page || 1;
    // let skipNum = req.query.skip || 0;
    // skipNum *= 2;
    
    let searchOptions = {
      from: perPage * (page - 1),
      size: perPage, 
      sort: { 
        'funding_end_date': 'asc'
      }
    };

    if (req.query.q) {

      Project.search(
      { // Query
        query_string: { 
          query: req.query.q
        }
      }, searchOptions, (err, results) => {
        if (err) {
          console.log('err: \n\n', err ,'\n');
          req.flash('danger', 'Search error. Please try again.');
          return res.redirect('/projects');
        }
        let data = results.hits.hits.map((hit) => {
          return hit;
        });

        data.forEach((project) => {
          project._source.tilEnd = getDayTilEnd(project._source.funding_end_date);
          project._source.fundingPercentage = getFundingPercentage(project._source.funding_goal, project._source.current_funding);
        });

        if (page == 1) {
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

        // Project.count().exec(function(err2, count) {
        //   if (err2) {
        //     console.log('err2: ', err2);
        //     req.flash('danger', 'Error occured. Please try again.');
        //     return res.redirect('/projects');
        //   }
          
        //   console.log('COUNT: ', count);
        //   console.log('PAGE: ', page);
        //   console.log('QUERY: ', req.query.q);
          
        //   let pages = [];
        //   for(let i = 1; i <= (count / perPage); i++) {
        //     pages.push(i);
        //   }

        //   console.log('PAGES Array: ', pages);
        //   console.log('DATA: ', data);

        //   return res.render('projects/search-result', {
        //     products: data,
        //     pages: pages,
        //     query: req.query.q
        //   });
        // });

      });

    } else {
      return;
    }
  },

  loadMoreResult(req, res) {

  }

};

export default searchHandler;