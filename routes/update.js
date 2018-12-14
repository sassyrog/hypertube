var express = require('express');
var router = express.Router();
var session = require('express-session');
const passport = require('passport');

const bcrypt = require('bcryptjs');

let User = require('../models/user');
let Lang = require('../config/languages');


var chalk = require('chalk');


router.post('/', (req, res) => {

    var id = req.session.passport.user._id;
    console.log(id);
    var respObj = {};

    // console.log(req.body);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const pic = req.body.pic;

    User.findById(id, function(err, user) {
        if (firstname)
            user.firstname = firstname;
        if (lastname)
            user.lastname = lastname;
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (pic)
            user.profile_img = pic;
        user.save((err) => {
            if (err)
                console.log(err);
            // console.log(req.session)
            req.session.destroy(function(err) {});
        })
        if (password) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    user.password = hash;
                    user.save((err) => {
                        if (err)
                            console.log(err);
                        req.session.destroy(function(err) {});

                    })
                });
            });
        }
        // console.log(user);
    });
    // res.contentType('json');
    res.send(req.user);
})


router.post('/email', (req, res) => {
    var id = req.session.passport.user._id;
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
    var id = req.session.passport.user._id;
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