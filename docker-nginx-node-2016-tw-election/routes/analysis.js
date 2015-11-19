/* services */
var express = require('express');
var router = express.Router();

/* mongodb */
var monk = require('monk'),
    url = process.env.MONGODB_USER + ':' + process.env.MONGODB_USER_PWD + '@' + process.env.MONGODB_INSTANCE_DNS + ':27017/2016_tw_election',
    db = monk(url),
    analysis_by_lang_type_collection = db.get('analysis_by_lang_type'),
    plurk_posts_analysis_by_lang_type_collection = db.get('plurk_posts_analysis_by_lang_type'),
    facebook_posts_collection = db.get('facebook_politicians_posts');


// routers
router.get('/text_analysis', function(req, res, next) {
  res.render('text_analysis', {});
});

module.exports = router;
