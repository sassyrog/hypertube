var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
var flash = require('connect-flash');
const passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

let User = require('../models/user');

router.get('/register', function(req, res) {
    res.render('register');
});

//register process.argv

router.post('/register', function(req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;

    req.checkBody('firstname', 'firstname is required').notEmpty();
    req.checkBody('lastname', 'lastname is required').notEmpty();
    req.checkBody('username', 'username is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email not valid').isEmail();
    req.checkBody('password1', 'password is required').notEmpty();
    req.checkBody('password2', 'passwords  do not match').equals(req.body.password1);

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password1
        });

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'you are now registered');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

router.get('/login', function(req, res) {
    res.render('login');
});

// Login Process
router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;