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
var videoRouter = require('./routes/video');
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
app.use('/video', videoRouter);
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


app.get('/sea', (req, response) => {
    var yy = [];
    mdb.searchMovie({
        query: 'it'
    }, (err, res) => {
        for (i = 0; i < res.results.length; i++) {
            yy.push({
                'id': res.results[i].id,
                'title': res.results[i].title,
                'desc': res.results[i].overview,
                'year': res.results[i].release_date.substring(0, 4),
                'pic': 'https://image.tmdb.org/t/p/w500' + res.results[i].backdrop_path,
                'pic2': 'https://image.tmdb.org/t/p/w500' + res.results[i].poster_path,
                'lang': res.results[i].original_language,
                'rate': res.results[i].vote_average
            });
        }
        response.render('home', {
            img: yy
        });
    })
})

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