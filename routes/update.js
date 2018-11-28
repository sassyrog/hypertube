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
            console.log('email');
        else if (user && user.username == username) {
            console.log('username');
        }
    });

    res.redirect('/test');


})

module.exports = router;