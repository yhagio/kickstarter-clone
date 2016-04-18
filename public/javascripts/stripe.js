
// This identifies your website in the createToken call below
Stripe.setPublishableKey('pk_test_Xn5nWxjEXpqZ4SJQQs1cyB2K');

function stripeResponseHandler(status, response) {
  var $form = $('#payment-form');

  if (response.error) {

    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('.payment-errors').addClass('alert alert-danger stripe-error');
    $form.find('button').prop('disabled', false);
  } else {
    
    // response contains id and card, which contains additional card details
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and submit
    $form.get(0).submit();
  }
}

jQuery(function($) {
  $('#payment-form').submit(function(event) {

    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);
    // Prevent the form from submitting with the default action
    return false;
  });
});