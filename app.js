var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
const expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var videoRouter =  require('./routes/video');

const config = require('./config/database');
const rp = require('request-promise');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

var http = require('http');

const mongooseValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const md5 = require('md5');
const uuid = require('shortid');
var chalk = require('chalk');

var torrentStream = require('torrent-stream');

const mdb = require('moviedb')('5d54c4f8fe9a065d6ed438ef09982650');

mongoose.connect(config.database, {
    useNewUrlParser: true
});
let db = mongoose.connection;

// Check connection
db.once('open', function() {
    console.log(chalk.yellow('Connected to MongoDB'));
});




// console.log(rand(15));
// console.log((+new Date).toString(36).slice(-12));

// Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');

hbs.registerHelper('ifCond', function(v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.enable('trust proxy');

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    proxy: true
}));

app.use(expressValidator()), require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

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

// var torrentStream = require('torrent-stream');
//
// var engine = torrentStream('magnet:?xt=urn:btih:966D30A8BBC61A1FB50842CAB6983B17ECA2CF9A&dn=Big%20Hero%206%20(2014)&tr=udp://open.demonii.com:1337&tr=udp://tracker.istole.it:80&tr=http://tracker.yify-torrents.com/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com:6969/announce');
//
// engine.on('ready', function() {
//     engine.files.forEach(function(file) {
//         console.log('filename:', file.name);
//         var stream = file.createReadStream();
//         // stream is readable stream to containing the file content
//     });
// });

// const query = require('yify-search');

// query.search('cars', (error, result) => {
//     console.log(result);
// })

var request = require("request")
 
// var ur = "https://restcountries.eu/rest/v2/lang/es"

// request({
//     url: ur,
//     json: true
// }, function (error, response, body) {

//     if (!error && response.statusCode === 200) {
//         console.log(body) // Print the json response
//     }
// })




app.use(bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
    parameterLimit: 50000
}));
app.use(bodyParser.json({
    limit: '50mb',
    parameterLimit: 50000
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('assets'));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/video', videoRouter);

// app.get('/video', function(req, res) {
//     res.render('video');
// });




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
        res.redirect('/home');
    });




var searchRouter = require('./routes/movie');
app.use('/movie', searchRouter);

app.use('/movie/info', require('./routes/movie_info'));

app.use('/user/update', require('./routes/update'));

app.use('/forgot/password', require('./routes/password_reset'));

app.use('/comments', require('./routes/comments'));

app.use('/see/other/users', require('./routes/other_users'));




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
