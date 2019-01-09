var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
var flash = require('connect-flash');
const passport = require('passport');
const emailExistence = require('email-existence');

const fs = require('fs');

require('../config/passport')(passport);
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

let User = require('../models/user');

router.get('/register', function (req, res) {
	res.render('register');
});

router.post('/register', function (req, res) {
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const username = req.body.username;
	const email = req.body.email.toLowerCase();
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
		res.render('register', {
			errors: errors
		});
	} else {
		User.findOne({
			username: {
				"$regex": "^" + username + "\\b",
				"$options": "i"
			}
		}, function (err, user) {
			User.findOne({
				email: {
					"$regex": "^" + email + "\\b",
					"$options": "i"
				}
			}, function (err, mail) {
				if (user || mail) {
					if (user) {
						res.render('register', {
							firstname: firstname,
							lastname: lastname,
							email: email,
							user_err: 'username already taken'
						});
					} else if (mail) {
						res.render('register', {
							firstname: firstname,
							lastname: lastname,
							username: username,
							mail_err: 'email already exists'
						});
					}
				} else {
					emailExistence.check(email, function (error, response) {
						if (!response) {
							res.render('register', {
								firstname: firstname,
								lastname: lastname,
								username: username,
								mail_err: 'email does not exist'
							});
						} else {
							var newUser = new User({
								firstname: firstname,
								lastname: lastname,
								username: username,
								email: email,
								password: password1,
								profile_img: '/images/avatar.png'
							});
							User.createUser(newUser, function (err, user) {
								if (err) throw err;
							});
							req.flash('success_msg', 'You are registered and can now login');
							res.redirect('/users/login');
						}
					});
				}
			});
		});
	}
});

router.get('/login', function (req, res) {
	res.render('login', {
		title: 'login'
	});
});

router.post('/login',
	passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: true
	}),
	function (req, res) {
		req.session.save(() => {
			res.redirect('/home');
		})
	}
);

module.exports = router;