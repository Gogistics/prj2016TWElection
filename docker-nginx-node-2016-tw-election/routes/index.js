/* index dispatcher */
var express = require('express');
var router = express.Router();

// json handler
var jsonfile = require('jsonfile');
var index_info = jsonfile.readFileSync('./my_dicts/index.json');

// routers
router.get('/', function(req, res, next) {
  if(index_info === undefined){
    index_info = jsonfile.readFileSync('./my_dicts/index.json');
  }

  // get lang query
  var lang;
  if( req.query.hasOwnProperty('lang') && index_info.hasOwnProperty(req.query.lang) ){
    lang = req.query.lang;
  }else{
    lang = 'english';
  }

  // set page info
  var page_info = {
    title : index_info[lang]['title'],
    nav_home : index_info[lang]['nav_home'],
    nav_twitter : index_info[lang]['nav_twitter'],
    nav_about : index_info[lang]['nav_about'],
    nav_contact : index_info[lang]['nav_contact'],
    nav_dropdwon_languages : index_info[lang]['nav_dropdwon_languages'],
    nav_dropdown_traditional_chinese : index_info[lang]['nav_dropdown_traditional_chinese'],
    nav_dropdown_english : index_info[lang]['nav_dropdown_english'],
    intro : index_info[lang]['intro'],
    footer_copyright : index_info[lang]['footer_copyright']
  };

  res.render('index', page_info);
});

module.exports = router;