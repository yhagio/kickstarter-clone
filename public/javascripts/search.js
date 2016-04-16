// if (window.location.pathname === '/search') {

//   document.getElementById("search-page-list").addEventListener("click",function(e) {

//     if(e.target && e.target.nodeName == "A") {

//       // console.log(e.target.id + " was clicked");
//       // console.log('val: ', e.target.textContent);
//       // console.log('query: ', $('#search-query').text());
//       // console.log('URL: ', window.location);

//       window.location.search = '?q=' + $('#search-query').text() + '&page=' + e.target.textContent;
//     }
//   });
// }






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
      // Display the additional projects loaded
      if(data){
        history.pushState(null, null, '/search?q=' + $('#search-query').text() + '&page=' + pageNum);
        $('#project-result-box').append(data);

        // window.location.search = '?q=' + $('#search-query').text() + '&page=' + e.target.textContent;
      } else {
        // If no more projects, change the color of 'Load More' button
        // to indicate that there are no more projects to load
      }
    },
    error: function(err){
      console.log('Error \n', err);
    }

  })

}, false);