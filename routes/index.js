var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res){
    res.render('index', {
        messages: req.flash('success'),
        user: req.user
    });
});

router.get('/login', function(req, res){
    res.render('login', {
        messages: req.flash('error'),
        user: req.user
    });
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
}));

router.get('/register', function(req, res){
    res.render('register', {
        messages: req.flash('error'),
        user: req.user
    });
});

router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/register',
    successFlash: true,
    failureFlash: true
}));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;
