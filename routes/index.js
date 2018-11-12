var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
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

module.exports = router;