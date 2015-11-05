/* services */
var express = require('express');
var router = express.Router();

// mandrill email service
var mandrill = require('mandrill-api/mandrill'), mandrill_client = undefined;
var init_mandrill_service = function(){
  mandrill_client = new mandrill.Mandrill(process.env.MY_MANDRILL_API_KEY);
  mandrill_client.users.info({}, function(result) {
      // console.log(result);
  }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });

  mandrill_client.users.info({}, function(result) {
    // console.log(result);
  }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
}
init_mandrill_service();

/* GET users listing. */
router.post('/send_email', function(req, res, next) {
  //
  if(mandrill_client === undefined){
    init_mandrill_service();
  }

  // get req info
  var sender_name = req.body.sender_name,
      sender_email = req.body.sender_email,
      email_subject = req.body.email_subject,
      email_message = req.body.email_message;

  // create a variable for the API call parameters
  var params = {
      "message": {
          "from_email":sender_email,
          "to":[{"email":"gogistics@gogistics-tw.com"}],
          "subject": email_subject,
          "text": email_message
      }
  };

  // send email
  mandrill_client.messages.send(params, function(res){
    console.log(res);
  }, function(err){
    console.log(err);
  });

  res.send({
    email_status : 'successful',
    msg : 'Thank you for contacting us.'
 });
});

module.exports = router;
