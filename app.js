const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const config = require('./config/index');
const logger = require('./libs/log');
const sendHttpError = require('./middleware/sendHttpError');
const { HttpError } = require('./error');
const session = require('express-session');

const routes = require('./routes/index');

// const users = require('./routes/users');

const app = express();
app.set('port', config.get('port'));

const server = http.createServer(app);

server.listen(app.get('port'), () => {
  logger.info("Express server listen port"+ app.get('port'));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger.log('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sendHttpError({ app }));

app.use(cookieParser());

const sessionStore = require('./libs/sessionStorage');

app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  store: sessionStore,
}));

app.use((req, res, next) => {
  req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
  // res.send("VISITS: " + req.session.numberOfVisits);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
// app.use('/users', users);

// console.log("HttpError", HttpError);
app.use((err, req, res, next) => {
  if (typeof err === 'number') {
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  }
});

require('./socket')(server);

// catch 404 and forward to error handler
/* app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handlers

// development error handler
// will print stacktrace
/* if (app.get('env') === 'development') {
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
