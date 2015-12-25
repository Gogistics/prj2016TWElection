/* main.js hosts the app */
var express = require('express'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  streams = require('./my_modules/streams.js')(),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  errorHandler = require('errorhandler');

/* init app */
var app = express(),
    cache_time = 1 * 86400000;

app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'jade');
app.use(favicon(__dirname + '/public/images/icons/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// set session & cookie
app.use(session({
  secret: '14FWERF32BRB465YUM34LI75632LOL89',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 600000, httpOnly: true }
}));
app.use(cookieParser('0QWE97GE68G3RH486JT73JKY0267XBN011'));

// set static paths
app.use('/public', express.static( path.join(__dirname, '/public'), { maxAge: cache_time}));

// dev. only
if('development' === app.get('env')){
  app.use(errorHandler());
}

// set routers
var my_router = require('./routes/routes.js');
my_router(app, streams);

var app_server = app.listen(app.get('port'), function(){
  //
  console.log('Express server listening on port: ' + app.get('port'));
});

var io = require('socket.io').listen(app_server);
require('./my_modules/socket_handler.js')(io, streams);