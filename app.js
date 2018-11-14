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

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function() {
    console.log('Connected to MongoDB');
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
    res.locals.messages = require('express-messages')(req, res);
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

app.use('/', indexRouter);
app.use('/users', usersRouter);



require('./config/passport')(passport);
// Passport Middleware

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