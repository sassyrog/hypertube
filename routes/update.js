var express = require('express');
var router = express.Router();
var session = require('express-session');
const passport = require('passport');

let User = require('../models/user');

router.post('/', (req, res) => {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;

    User.findById('5bf42bae9191be2086e4d0a8', function(err, user) {
        console.log(user);
    })
    User.findOne({
        $or: [{
            'email': email
        }, {
            'username': username
        }]
    }, function(err, user) {
        if (user && user.email == email)
            console.log('------>' + user + ' <--------');
        else if (user && user.username == username) {
            console.log('------>' + user + ' <--------');
        }
    });

    res.redirect('/test');


})

var id = '5c0783d3b2c80ef5831bb459';

router.post('/email', (req, res) => {
    User.findOne({
        email: {
            "$regex": "^" + req.body.email + "\\b",
            "$options": "i"
        }
    }, function(err, user) {
        if (user != null) {
            if (user.id == id) {
                res.send('same')
            } else {
                res.send('taken');
            }
        } else {
            res.send('available');
        }
    })
})

router.post('/username', (req, res) => {
    User.findOne({
        username: {
            "$regex": "^" + req.body.username + "\\b",
            "$options": "i"
        }
    }, function(err, user) {
        if (user != null) {
            if (user.id == id) {
                res.send('same')
            } else {
                res.send('taken');
            }
        } else {
            res.send('available');
        }
    })
})

module.exports = router;