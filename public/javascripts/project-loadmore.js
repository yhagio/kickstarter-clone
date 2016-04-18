'use strict';
// Counting number that 'Load More' button is clicked
// in order to determine how many projects to skip in server
var skipNum = 1;

if (window.location.pathname === '/projects' || window.location.pathname.indexOf('categories') >= 0) {
  // Load More functionality
  document.getElementById('loadMoreProjects').addEventListener('click', function(e) {
    e.preventDefault();

    skipNum++;

    // Get the additional event data from server
    $.ajax({
      type: "GET",
      data: {
        skipNum: skipNum
      },
      url: "/projects",
      success: function(data){
        if(data){
          console.log('*** DATA \n', data);
          // Display the additional projects loaded
          $('#projects-box').append(data);
        } else {
          console.log('NO DATA');
          $('#loadMoreProjects').removeClass('btn-info').addClass('disabled').text('No More');
          // If no more projects, change the color of 'Load More' button
          // to indicate that there are no more projects to load
        }
      },
      error: function(err){
        console.log('Error \n', err);
      }

    })

  }, false);

}