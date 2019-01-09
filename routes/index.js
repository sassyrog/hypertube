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
        req.flash('error', 'Please login first');
        res.redirect('/login');
    }
}


router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'hypertube'
    });
});

router.get('/profile/update', (req, res) => {
    res.render('profile_update', {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        username: req.user.username,
        email: req.user.email,
        pic: req.user.profile_img
    });
})

// router.get('/video', function(req, res) {
//     res.render('video');
// });


router.get('/user/profile', loggedIn, (req, res) => {
    var info = req.session.passport.user;
    if (info) {
        res.render('profile', {
            title: 'user profile',
            firstname: info.firstname,
            lastname: info.lastname,
            username: info.username,
            email: info.email,
            pic: info.profile_img,
            movies: info.movies
        });
    } else {
        res.render('profile');
    }
})

router.get('/reset', (req, res, next) => {
    if (req.user) {
        req.flash('success_msg', 'already logged in')
        res.redirect('/home')
    } else {
        next();
    }
}, (req, res) => {
    res.render('reset_form');
})

router.get('/login', (req, res, next) => {
    if (req.user) {
        req.flash('success_msg', 'already logged in')
        res.redirect('/home')
    } else {
        next();
    }
}, function (req, res) {
    res.render('login', {
        title: 'login'
    });
});

router.get('/home', loggedIn, function (req, res) {
    var info = req.session.passport.user;
    if (info) {
        res.render('home', {
            title: 'home',
            firstname: info.firstname,
            lastname: info.lastname,
            username: info.username,
            email: info.email,
            pic: info.profile_img
        });
    } else {
        res.render('home');
    }
});

router.get('/other/users', loggedIn, function (req, res) {
    var info = req.session.passport.user;
    if (info) {
        res.render('other_users', {
            title: 'Other users',
            firstname: info.firstname,
            lastname: info.lastname,
            username: info.username,
            email: info.email,
            pic: info.profile_img
        });
    } else {
        res.render('other_users');
    }
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) return next(err)
        req.logout()
        res.redirect('/');
    });
});

router.get('/register', function (req, res) {
    res.render('register', {
        title: 'registration'
    });
});

router.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

router.get('/auth/google',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    })
);

router.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['email']
    }));

router.get('/auth/42',
    passport.authenticate('42'));


module.exports = router;