'use strict';

function removeComment(e) {
  $.ajax({
    type: 'POST',
    url: '/delete-comment',
    data: {commentId: window.event.target.id, pathname: window.location.pathname},
    success: function(data, textStatus, jqXHR) {
      debugger;
      window.location.pathname = data.redirect;
    }
  });
}