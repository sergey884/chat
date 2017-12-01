var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var config = require('./config/index');
var logger = require('./libs/log');
const sendHttpError = require('./middleware/sendHttpError');
const { HttpError } = require('./error');
const mongoose = require('./libs/mongoose');
var session = require('express-session');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();
app.set("port", config.get('port'));

const server = http.createServer(app)

server.listen(app.get('port'), function() {
  logger.info("Express server listen port"+ app.get('port'));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger.log('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sendHttpError({ app }));

app.use(cookieParser());

const MongoStore = require("connect-mongo")(session);
// console.log(mongoose.connection);
app.use(session({
  secret: config.get("session:secret"),
  key: config.get("session:key"),
  cookie: config.get("session:cookie"),
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));

app.use(function(req, res, next) {
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  // res.send("VISITS: " + req.session.numberOfVisits);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
// app.use('/users', users);

// console.log("HttpError", HttpError);
app.use(function(err, req, res, next) {
  if (typeof err === 'number') {
    err = new HttpError(err);
  } 

  if( err instanceof HttpError ) {
    res.sendHttpError(err);
  }
});


// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handlers

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
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
*/

module.exports = app;
