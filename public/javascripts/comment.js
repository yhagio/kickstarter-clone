'use strict';

function removeComment(e) {
  $.ajax({
    type: 'POST',
    url: '/delete-comment',
    data: {commentId: window.event.target.id, pathname: window.location.pathname},
    success: function(data, textStatus, jqXHR) {
      window.location.pathname = data.redirect;
    }
  });
}



// Counting number that 'Load More' button is clicked
// in order to determine how many projects to skip in server
var commentSkipNum = 0;

if (window.location.pathname.indexOf('projects/') >= 0) {

  // Load More functionality
  document.getElementById('loadMoreComments').addEventListener('click', function(e) {
    e.preventDefault();

    commentSkipNum++;

    // Get the additional event data from server
    $.ajax({
      type: "GET",
      data: {
        commentSkipNum: commentSkipNum
      },
      url: window.location.pathname,
      success: function(data){
        if(data){
          console.log('*** DATA \n', data);
          // Display the additional projects loaded
          $('#commentList').append(data);
        } else {
          console.log('NO DATA');
          $('#loadMoreComments').removeClass('btn-info').addClass('disabled').text('No More');
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