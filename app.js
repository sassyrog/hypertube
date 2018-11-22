var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
const expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const config = require('./config/database');

const mongooseValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const uuid = require('shortid');

var chalk = require('chalk');
const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');

mongoose.connect(config.database, {
    useMongoClient: true
});
let db = mongoose.connection;

// Check connection
db.once('open', function() {
    console.log(chalk.yellow('Connected to MongoDB'));
});

// Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Express Validator Mid


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator())
require('./config/passport')(passport);

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }),

    function(req, res) {
        res.redirect('/home');
    });

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        res.redirect('/home');
    });

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/home',
        failureRedirect: '/login'
    }));

app.get('/auth/42/callback',
    passport.authenticate('42', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/home');
    });


var searchRouter = require('./routes/movie');
app.use('/movie', searchRouter);


app.use('/movie/info', require('./routes/movie_info'));
// var MovieDB = require('node-moviedb');
//
//
// MovieDB.search('Prison Break', {}, (err, response) => {
//     if (err) console.log(err);
//     console.log(response);
// });
// // var magnet = require('magnet-scraper');
// //
//
// var opts = {
//     url: "https://pirateproxy.red/",
//     page: 2, // note: start in 0.
//     cat: 200 // Audio = 100, Video = 200, Apps = 300, Games = 400, Porn = 500
// }
// magnet.search("johnny english", opts, function(err, res) {
//     console.log(res);
// });







//






// const PirateBay = require('thepiratebay')
//
// app.get('/search', (req, res) => {
//     PirateBay.search('Fantastic Beasts', {
//             category: 207
//         })
//         .then(results => console.log(results))
//         .catch(err => console.log(err))
//     res.render('search')
// })



// const MytsApi = require('myts-api').API;
// const myts = new MytsApi();
// // var query = require('yify-search');
// // console.log(query);
// var query = require('yify-query')
// query('The Imitation Game (2014)', (error, result) => {
//     console.log(result);
// });

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;