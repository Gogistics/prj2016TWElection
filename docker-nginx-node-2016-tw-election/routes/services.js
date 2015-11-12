/* services */
var express = require('express');
var router = express.Router();

/* mongodb */
var monk = require('monk'),
    url = process.env.MONGODB_USER + ':' + process.env.MONGODB_USER_PWD + '@' + process.env.MONGODB_INSTANCE_DNS + ':27017/2016_tw_election',
    db = monk(url),
    analysis_by_lang_type_collection = db.get('analysis_by_lang_type'),
    plurk_posts_analysis_by_lang_type_collection = db.get('plurk_posts_analysis_by_lang_type');

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

/* POST users listing. */
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

// POST get latest 20 tweets
router.post('/get_latest_20_tweets', function(req, res, next) {
  // get req info
  var user_ip = req.ip;
  res.send({
    request_status : 'successful',
    latest_20_tweets : {}
 });
});

// get twitter analysis collection
router.post('/get_twitter_tweets_analysis_collection_by_lang_type', function(req, res, next){
  //
  var user_ip = req.ip,
      token = req.token;
  analysis_by_lang_type_collection.findOne({}).on('success', function (doc) {
    //
    delete doc._id;
    var count_of_total_tweets = 0;
    for(var ith_key in doc){
      for(var jth_key in doc[ith_key]['timestamp_set']){
        count_of_total_tweets += doc[ith_key]['timestamp_set'][jth_key];
      }
    }
    res.send({
      request_status : 'successful',
      collecion : doc,
      count_of_total_tweets : count_of_total_tweets
    });
  });
});

// get plurk analysis collection
router.post('/get_plurk_posts_analysis_collection_by_lang_type', function(req, res, next){
  //
  var user_ip = req.ip,
      token = req.token;
  plurk_posts_analysis_by_lang_type_collection.findOne({}).on('success', function (doc) {
    //
    delete doc._id;
    var count_of_total_tweets = 0;
    for(var ith_key in doc){
      for(var jth_key in doc[ith_key]['timestamp_set']){
        count_of_total_tweets += doc[ith_key]['timestamp_set'][jth_key];
      }
    }
    res.send({
      request_status : 'successful',
      collecion : doc,
      count_of_total_tweets : count_of_total_tweets
    });
  });
});

module.exports = router;
