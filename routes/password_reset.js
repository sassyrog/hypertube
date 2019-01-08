const express = require('express');
const router = express();
var nodemailer = require('nodemailer');
var mail = require('../config/email.json');
const bcrypt = require('bcryptjs');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
let User = require('../models/user');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: mail.email,
		pass: mail.pass
	}
});

router.post('/', (req, res) => {

	User.findOne({
		email: {
			"$regex": "^" + req.body.email + "\\b",
			"$options": "i"
		}
	}, (err, user) => {
		if (user) {

			var templateDir = path.resolve(__dirname, '..', 'templates/emails');

			hashPromise = new Promise((resolve, reject) => {
				bcrypt.genSalt(10, function(err, salt) {
					bcrypt.hash(user.id, salt, function(err, hash) {
						if (err)
							reject(err)
						else {
							resolve(hash + '=' + user.username)
						}
					});
				});
			});

			hashPromise.then((value) => {
				data = value;
				var template = new EmailTemplate(templateDir)
				let buff = new Buffer.from(data);
				link = buff.toString('base64');
				var locals = {
					link: 'http://localhost:8080/forgot/password/' + link
				}
				template.render(locals, function(err, result) {
					if (err)
						console.log(err);
					var mailOptions = {
						from: 'camagrurmdaba@gmail.com',
						to: user.email,
						subject: 'Hypertube password reset',
						html: result.html
					};
					transporter.sendMail(mailOptions, function(error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});
				})
				req.flash('success_msg', 'check you mailbox for password reset link');
				res.redirect('/users/login');
			})
		} else {
			res.render('reset_form', {
				mail_err: 'no such email',
				email: req.body.email
			})
		}
	})
})

router.get('/:token', (req, res) => {

	let buff = new Buffer.from(req.params.token, 'base64');
	let token = buff.toString('ascii');

	id = token.split('=')[0];
	username = token.split('=')[1];

	User.findOne({
		username: {
			"$regex": "^" + username + "\\b",
			"$options": "i"
		}
	}, (err, user) => {
		if (user) {
			// res.send(user.id);
			bcrypt.compare(user.id, id, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					res.render('new_password', {
						user_id: user.id
					});
				} else {
					console.log('no');
					req.flash('error', 'invalid or broken link')
					res.redirect('login')
				}
			});
		} else {
			req.flash('error', 'invalid or broken link')
			res.redirect('/login')
		}
	})
	// res.send(username)
})

router.post('/reset/new', (req, res) => {
	const password1 = req.body.password1;
	const password2 = req.body.password2;
	const id = req.body.id;

	req.checkBody('id', 'something is wrong').notEmpty();
	req.checkBody('password1', 'password is required').notEmpty();
	req.checkBody('password2', 'passwords  do not match').equals(req.body.password1);


	let errors = req.validationErrors();

	if (errors) {
		res.render('new_password', {
			errors: errors
		});
	} else {
		User.findById(id, (err, user) => {
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password1, salt, (err, hash) => {
					if (err)
						reject(err)
					else {
						user.password = hash;
						user.save((err) => {
							if (err)
								console.log(err);
							else {
								req.login(user, function(err) {
									if (err) {
										return next(err);
									}
									req.flash('success_msg', 'You are registered and can now login');
									res.redirect('/home');
								});
							}
						})
					}
				});
			});
		})
	}
})

module.exports = router;