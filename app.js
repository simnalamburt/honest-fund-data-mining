// external modules
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var sassMiddleware = require('node-sass-middleware');

// internal modules
var Unprocessed = require('./models/unprocessed.js');

// create express app
var app = express();

// setup express
app.set('view engine', 'ejs');
app.use(sassMiddleware({
    src: './scss',
    dest: './static/css',
    prefix: '/css'
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('static'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'dain'
}));
app.use(flash());

// setup db
require('./config/database')(mongoose);

// setup passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(function(req, res, next){
    var up = new Unprocessed();

    up.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    up.url = req.url;
    up.timestamp = Date.now();

    if(req.user){
        up.email = req.user.email;
    }

    up.save(function(err){
        if(err){
            console.log('up: save query error');
            return next(err);
        }
        console.log('up: ' + JSON.stringify(up));
        next(null);
    });
});
app.use('/', require('./routes/index.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
