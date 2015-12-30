/* required modules */
var express = require('express'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler');
// end of add modules

/* port setting */
var DEFAULT_PORT = 8080,
    PORT = process.env.PORT || DEFAULT_PORT;

/* App setting */
var app = express(),
    cache_time = 1 * 86400000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // set favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set session & cookie
app.use(session({
  secret: 'CQEWC24VRE742374BOCQIOJWE6310CWOM',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 600000, httpOnly: true }
}));
app.use(cookieParser('FEWR13GE454WF97683E30G2NIKT670ACEBV'));

// static files config.
app.use('/public', express.static( path.join(__dirname, '/public'), { maxAge: cache_time}));
app.use('/es5-shim', express.static(path.join(__dirname, '/bower_components/es5-shim')));
app.use('/json3', express.static(path.join(__dirname, '/bower_components/json3/lib')));

/* routers setting */
var index_dispatcher = require('./routes/index');
app.use('/', index_dispatcher);
var services_dispatcher = require('./routes/services');
app.use('/services', services_dispatcher);
var analysis_dispatcher = require('./routes/analysis');
app.use('/analysis', analysis_dispatcher);

/* error handler */
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

app.listen(PORT)
console.log('Running on http://localhost:' + PORT);
