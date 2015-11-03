/* index dispatcher */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  // res.send('Hello World...\n');
  res.render('index', { title : '2016 Taiwan Election'});
});

module.exports = router;