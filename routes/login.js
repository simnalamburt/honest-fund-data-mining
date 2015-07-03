var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res){
    console.log(res.locals.flash);
    res.render('login');
});

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/login',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
}));

module.exports = router;
