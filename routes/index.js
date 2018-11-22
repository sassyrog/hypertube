var express = require('express');
var router = express.Router();

const passport = require('passport');

//route handlers

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/video', function(req, res) {
    res.render('video');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/home', function(req, res) {
    res.render('home');
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    })
);

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/42',
    passport.authenticate('42'));


module.exports = router;