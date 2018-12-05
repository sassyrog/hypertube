const express = require('express');
const router = express();
var nodemailer = require('nodemailer');
var mail = require('../config/email.json');

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
            var mailOptions = {
                from: 'camagrurmdaba@gmail.com',
                to: user.email,
                subject: 'Sending Email using Node.js',
                html: '<a href="http://localhost:8080/password/reset">here</a>'
            };
            req.flash('success_msg', 'check you mailbox for password reset link');
            res.redirect('/users/login');
        } else {
            res.render('reset_form', {
                mail_err: 'no such email',
                email: req.body.email
            })
        }
    })


    // transporter.sendMail(mailOptions, function(error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
    // res.send(req.body);
})


module.exports = router;