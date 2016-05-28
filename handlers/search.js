'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _project = require('../models/project');

var _project2 = _interopRequireDefault(_project);

var _helpers = require('../helpers/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchHandler = {
  postSearch: function postSearch(req, res) {
    // Initial search from the form does not contain "page" so assign it 1
    var page = req.body.page || 1;
    // Redirect with 2 queries (search query & page number)
    res.redirect('/search?q=' + req.body.q + '&page=' + page);
  },
  getSearchResult: function getSearchResult(req, res) {
    console.log("req.query: \n", req.query);

    // .i.e
    // per page = 5
    // P.1 = 1-5
    // P.2 = 6-10
    // P.3 = 11-15

    var page = 0;
    if (req.query.page <= 1) {
      page = 0;
    } else {
      page = req.query.page;
    }

    var perPage = 20;
    // let page = req.query.page || 0;

    var searchOptions = {
      from: perPage * page,
      size: perPage,
      sort: {
        'funding_end_date': 'asc'
        // 'createdAt': -1
      }
    };

    // console.log('*** searchOptions \n', searchOptions);

    if (req.query.q) {

      _project2.default.search({ // Query
        query_string: {
          query: req.query.q
        }
      }, searchOptions, function (err, results) {
        if (err) {
          console.log('*** err: \n\n', err, '\n');
          req.flash('danger', 'Search error. Please try again.');
          return res.redirect('/projects');
        }
        var data = results.hits.hits.map(function (hit) {
          return hit;
        });

        data.forEach(function (project) {
          project._source.tilEnd = (0, _helpers.getDayTilEnd)(project._source.funding_end_date);
          project._source.fundingPercentage = (0, _helpers.getFundingPercentage)(project._source.funding_goal, project._source.current_funding);
          project._source.currentFunds = Math.floor(project._source.current_funding / 100);
          project._source.isProjectActive = new Date() < project._source.funding_end_date;
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

exports.default = searchHandler;