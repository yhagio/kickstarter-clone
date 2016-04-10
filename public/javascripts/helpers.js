// Close flash message automatically after displayed 4 seocnds
$("#flash-box").alert();
window.setTimeout(function() { 
  $("#flash-box").alert('close'); 
}, 4000);

$(function () {
  $('#datetimepicker1').datetimepicker();
});

$(function () {
  $('#datetimepicker2').datetimepicker();
});