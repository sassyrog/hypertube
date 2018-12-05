var express = require('express');
var router = express.Router();
var session = require('express-session');
const passport = require('passport');

//route handlers

// router.get('/video', function(req, res) {
//     res.render('video');
// });

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'hypertube'
    });
});

router.get('/profile/update', (req, res) => {
    res.render('profile_update', {
        // firstname: req.user.firstname,
        // lastname: req.user.lastname,
        // username: req.user.username,
        // email: req.user.email
    });
})

// router.get('/video', function(req, res) {
//     res.render('video');
// });


router.get('/user/profile', (req, res) => {
    res.render('profile');
})

router.get('/reset', (req, res) => {
    res.render('reset_form');
})

router.get('/login', function(req, res) {
    res.render('login', {
        title: 'login'
    });
});

router.get('/home', function(req, res) {
    // console.log(req.user);
    res.render('home', {
        title: 'home'
    });
});

router.get('/test', function(req, res) {
    // console.log(req.user);
    res.render('test');
});

router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login']
    })
);

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/42',
    passport.authenticate('42'));


module.exports = router;