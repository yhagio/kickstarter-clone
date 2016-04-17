'use strict';
// Counting number that 'Load More' button is clicked
// in order to determine how many projects to skip in server
var pageNum = 1;

// Load More functionality
document.getElementById('loadMoreResult').addEventListener('click', function(e) {
  e.preventDefault();

  pageNum++;

  // Get the additional event data from server
  $.ajax({
    type: "POST",
    data: {
      q: $('#search-query').text(),
      page: pageNum
      // query: $('#search-query').text(),
      // skip: pageNum
    },
    url: "/search?q=" + $('#search-query').text() + '&page=' + pageNum,
    success: function(data){
      if(data){
        console.log('*** DATA \n', data);
        // Update URL without reloading the page
        history.pushState(null, null, '/search?q=' + $('#search-query').text() + '&page=' + pageNum);
        // Display the additional projects loaded
        $('#project-result-box').append(data);
      } else {
        console.log('NO DATA');
        $('#loadMoreResult').removeClass('btn-info').addClass('disabled').text('No More');
        // If no more projects, change the color of 'Load More' button
        // to indicate that there are no more projects to load
      }
    },
    error: function(err){
      console.log('Error \n', err);
    }

  })

}, false);