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

    User.findOne({
        username: {
            "$regex": "^" + username + "\\b",
            "$options": "i"
        }
    }, function(err, user) {
        User.findOne({
            email: {
                "$regex": "^" + email + "\\b",
                "$options": "i"
            }
        }, function(err, mail) {
            if (user || mail) {
                if (user) {
                    res.render('profile_update', {
                        user: 'username already taken'
                    });
                } else if (mail) {
                    res.render('profile_update', {
                        mail: 'email already exists'
                    });
                }
            }
        });
    });


    // User.findById('5bf42bae9191be2086e4d0a8', function(err, user) {
    //     console.log(req.body);
    //     if ('username' in req.body)
    //         console.log('yeah');
    //     console.log();
    //     user.firstname = 'roger';
    //     user.lastname = 'ndaba';
    //     user.save();
    //     console.log(user);
    // })
    res.redirect('/test');
})

module.exports = router;