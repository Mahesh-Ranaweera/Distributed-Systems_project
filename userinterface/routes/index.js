var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/progress', function(req, res, next){
  res.render('progress', { title: 'progress'});
});

router.get('/represent', function(req, res, next){
  res.render('represent', {title: 'data representation'});
})

module.exports = router;
