/* required modules */
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');
// end of add modules

/* port setting */
var DEFAULT_PORT = 8080,
    PORT = process.env.PORT || DEFAULT_PORT;

/* App setting */
var app = express(),
    cache_time = 2 * 86400000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // set favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static files config.
app.use('/public', express.static( path.join(__dirname, '/public'), { maxAge: cache_time}));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist'))); // set bootstrap path ; maybe unnecessary
app.use('/jq', express.static(path.join(__dirname, '/node_modules/jquery/dist'))); // set jquery path ; maybe unnecessary

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
