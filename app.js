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
var useragent = require('express-useragent');

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
app.post('/data', function(req, res){
    Unprocessed.findById(req.cookies['up._id'], function(err, up){
        if(err){
            console.log('up: findById query error');
            return res.end();
        }
        if(!up){
            console.log('up: base data not found');
            return res.end();
        }
        up.location = req.body.location;
        up.timestamp_exit = req.body.timestamp_exit;
        up.keystroke = req.body.keystroke;
        up.scroll = req.body.scroll;
        up.highlight = req.body.highlight;
        up.click = req.body.click;
        up.window = req.body.window;
        up.monitor = req.body.monitor;
        up.contact = req.body.contact;
        up.save(function(err){
            if(err){
                console.log(err);
                console.log('up: save query error');
                return res.end();
            }
            console.log('up saved: ' + JSON.stringify(up));
            res.end();
        });
    });
});
app.use(function(req, res, next){
    var up = new Unprocessed();

    up.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    up.url = req.url;
    up.timestamp = Date.now();
    up.referer = req.headers.referer;
    up.user_agent = req.headers['user-agent'];

    var ua = useragent.parse(req.headers['user-agent']);
    up.browser = ua.browser;
    up.os = ua.os;
    up.platform = ua.platform;

    if(req.user){
        up.email = req.user.email;
    }

    res.clearCookie('up._id');
    up.save(function(err){
        if(err){
            console.log('up: save query error');
            return next(err);
        }
        res.cookie('up._id', up._id);
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
