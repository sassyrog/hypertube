var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

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
    const username = req.body.username;
    const email = req.body.email;
    const password1 = req.body.password1;
    const password2 = req.body.password2;

    req.checkBody('username', 'username is rquired').notEmpty();
    req.checkBody('email', 'email is rquired').notEmpty();
    req.checkBody('email', 'email not valid').isEmail();
    req.checkBody('password', 'password is rquired').notEmpty();
    req.checkBody('username', 'passwords  do not match').equals(req.body.password1);

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
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

router.get('/login', function(req, res, next) {
    res.render('login');
});

module.exports = router;