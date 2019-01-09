const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FortyTwoStrategy = require('passport-42').Strategy;
var session = require('express-session');
const secrets = require('./secrets.json');
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
		bcrypt.genSalt(10, function (err, salt) {
			bcrypt.hash(newUser.password, salt, function (err, hash) {
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


module.exports = function (passport) {
	// Local Strategy
	passport.use(new LocalStrategy({
			passReqToCallback: true
		},
		function (req, username, password, done) {
			// Match Username
			let query = {
				username: username
			};
			console.log('------>' + username);

			User.findOne(query, function (err, user) {
				if (err) throw err;
				if (!user) {
					//find user by user username
					return done(null, false, {
						message: 'incorrect username or password'
					});
				}
				bcrypt.compare(password, user.password, function (err, isMatch) {
					if (err) throw err;
					if (isMatch) {
						return done(null, user, {
							success_msg: 'Welcome'
						});
					} else {
						return done(null, false, {
							username: user.username,
							message: 'incorrect username or password'
						});
					}
				});
			});
		}));

	//////////////////////// GITHUB STRATEGY //////////////////////////////////////

	passport.use(new GitHubStrategy({
			clientID: secrets.github.gh_key,
			clientSecret: secrets.github.s_gh_key,
			callbackURL: "http://localhost:8080/auth/github/callback",
			passReqToCallback: true
		},
		function (req, accessToken, refreshToken, profile, done) {
			var info = profile._json;

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
			clientID: secrets.google.g_key,
			clientSecret: secrets.google.s_g_key,
			callbackURL: "http://localhost:8080/auth/google/callback",
			passReqToCallback: true

		},
		function (req, accessToken, refreshToken, profile, done) {

			var info = profile._json;

			if (!info.emails[0].value) {
				req.flash('error', 'Google email not found');
				return done(null, false)
			}

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
			clientID: secrets.facebook.fb_key,
			clientSecret: secrets.facebook.s_fb_key,
			callbackURL: "http://localhost:8080/auth/facebook/callback",
			// passReqToCallback: true,
			profileFields: ['id', 'email', 'link', 'locale', 'name',
				'timezone', 'updated_time', 'verified', 'displayName'
			],
			passReqToCallback: true
		},
		function (req, accessToken, refreshToken, profile, done) {

			var info = profile._json;

			if (!info.email) {
				req.flash('error', 'Facebook email not found');
				return done(null, false)
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
			clientID: secrets.intra42.intra42_key,
			clientSecret: secrets.intra42.s_intra42_key,
			callbackURL: "http://localhost:8080/auth/42/callback",
			passReqToCallback: true
		},
		function (accessToken, refreshToken, profile, cb) {
			var info = profile._json;
			// console.log(info);

			if (!info.email) {
				req.flash('error', '42 email not found');
				return done(null, false)
			}

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

	passport.serializeUser(function (user, done) {
		// console.log(user);
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		// console.log(user);

		done(null, user);
	});
}