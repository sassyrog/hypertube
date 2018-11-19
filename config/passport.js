const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;


module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        // Match Username
        let query = {
            username: username
        };
        User.findOne(query, function(err, user) {
            if (err) throw err;
            if (!user) {
                //find user by user username
                return done(null, false, {
                    message: 'no such username'
                });
            }
            // Match Password
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
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
            callbackURL: "http://localhost:8080/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));

    //////////////////////// GOOGLE STRATEGY //////////////////////////////////////


    passport.use(new GoogleStrategy({
            clientID: "202153388050-i4fdja37bco0a7es2vq0sbdal3r2qbof.apps.googleusercontent.com",
            clientSecret: 'tPaXiD5MVZnjEyABAGLJINnI',
            callbackURL: "http://localhost:8080/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    ));

    //////////////////////// FACEBOOOK STRATEGY //////////////////////////////////////


    passport.use(new FacebookStrategy({
            clientID: '1407329682731096',
            clientSecret: '6c9720d3ae55ff163c11a0b3ec2d1056',
            callbackURL: "http://localhost:8080/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            done(null, profile);
        }
    ));

    //////////////////////// INTRA42 STRATEGY //////////////////////////////////////


    passport.use(new FortyTwoStrategy({
            clientID: '876afee190f35d4d97b390bf34a8a5c2da6e4f66e3293af1d5d1b5aa7bf2478b',
            clientSecret: '1e6d57b6ce905a3571bfc2b01caf0c7cb23e4ec5f9e733276bec393c25a7a5d8',
            callbackURL: "http://localhost:8080/auth/42/callback"
        },
        function(accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}