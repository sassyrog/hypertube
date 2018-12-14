const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
var session = require('express-session');

var ignoreCase = require('ignore-case');

function createUserSocial(username, firstname, lastname, email, callback, callback2, image = '/images/avatar.png') {
    var newUser = new User({
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        profile_img: image
    })
    hashPromise = new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err)
                    reject(err)
                else {
                    newUser.password = hash;
                    resolve(hash)
                }
            });
        });
    })

    hashPromise.then(() => {
        User.findOne({
            email: {
                "$regex": "^" + email + "\\b",
                "$options": "i"
            }
        }, (err, respEmail) => {
            if (!respEmail) {
                newUser.save(callback)
                console.log(newUser);
            } else {
                callback2(respEmail);
            }
        })
    })
}


module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy({ passReqToCallback: true },
        function(req, username, password, done) {
        // Match Username
        let query = {
            username: username
        };
        User.findOne(query, function(err, user) {
            if (err) throw err;
            if (!user) {
                //find user by user username
                req.flash('success_msg', 'Welcome');
                return done(null, false);
            }
            // Match Password
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user, {
                        success_msg: 'Welcome'
                    });
                } else {
                    return done(null, false, {
                        username: user.username,
                        message: 'wrong password my broer'
                    });
                }
            });
        });
    }));

    //////////////////////// GITHUB STRATEGY //////////////////////////////////////

    passport.use(new GitHubStrategy({
            clientID: '449bce79ea0b6ece13cb',
            clientSecret: '58e21c5ed194cf7a67c8d3af0dac9388f9c0555c',
            callbackURL: "http://localhost:8080/auth/github/callback",
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            var info = profile._json;
            console.log(info);
            
            if (!info.email) {
                req.flash('error', 'Git email not found');
                return done(null, false)
            }

            createUserSocial(
                info.login + info.id + '_git',
                info.name,
                'noSurname',
                info.email,
                (err, user) => {
                    if (err) throw (err);
                    done(null, user);
                },
                (value) => {
                    done(null, value);
                },
                info.avatar_url
            );
            // function createUserSocial(username, firstname, lastname = 'noSurname', email, image = '/images/avatar.png', password, callback, callback2) {
        }
    ));

    //////////////////////// GOOGLE STRATEGY //////////////////////////////////////


    passport.use(new GoogleStrategy({
            clientID: "202153388050-i4fdja37bco0a7es2vq0sbdal3r2qbof.apps.googleusercontent.com",
            clientSecret: 'tPaXiD5MVZnjEyABAGLJINnI',
            callbackURL: "http://localhost:8080/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {

            var info = profile._json;

            createUserSocial(
                info.name.givenName + info.id + '_g',
                info.name.givenName,
                info.name.familyName,
                info.emails[0].value,
                (err, user) => {
                    if (err) throw (err);
                    done(null, user);
                },
                (value) => {
                    done(null, value);
                },
                info.image.url + '0'
            );

            // console.log(profile);
            // return done(null, profile);
        }
    ));

    //////////////////////// FACEBOOOK STRATEGY //////////////////////////////////////


    passport.use(new FacebookStrategy({
            clientID: '1407329682731096',
            clientSecret: '6c9720d3ae55ff163c11a0b3ec2d1056',
            callbackURL: "http://localhost:8080/auth/facebook/callback",
            // passReqToCallback: true,
            profileFields: ['id', 'email', 'link', 'locale', 'name',
                'timezone', 'updated_time', 'verified', 'displayName'
            ]
        },
        function(accessToken, refreshToken, profile, done) {

            var info = profile._json;

            if (!info.email) {
                return done(null, false, {
                    message: 'facebook account is not linked to email address'
                });
            }
            createUserSocial(
                info.first_name + info.id + '_fb',
                info.first_name,
                info.last_name,
                info.email,
                (err, user) => {
                    if (err) throw (err);
                    done(null, user);
                },
                (value) => {
                    done(null, value);
                }
            );
            // console.log(profile);
            // done(null, profile);
        }
    ));
    //////////////////////// INTRA42 STRATEGY //////////////////////////////////////


    passport.use(new FortyTwoStrategy({
            clientID: '876afee190f35d4d97b390bf34a8a5c2da6e4f66e3293af1d5d1b5aa7bf2478b',
            clientSecret: '1e6d57b6ce905a3571bfc2b01caf0c7cb23e4ec5f9e733276bec393c25a7a5d8',
            callbackURL: "http://localhost:8080/auth/42/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            var info = profile._json;
            // console.log(info);
            
            img = '/images/avatar.png';
            createUserSocial(
                info.login + info.id + '_42',
                info.first_name,
                info.last_name,
                info.email,
                (err, user) => {
                    if (err) throw (err);
                    cb(null, user);
                },
                (value) => {
                    cb(null, value);
                },
                img
            );
        }
    ));

    passport.serializeUser(function(user, done) {
        // console.log(user);
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        // console.log(user);

        done(null, user);
    });
}