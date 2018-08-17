const async = require('async');
const cookie = require('cookie');
const logger = require('../libs/log');
const config = require('../config/index');
const { HttpError } = require('../error');
const sessionStore = require('../libs/sessionStorage');
const { User } = require('../models/user');
const cookieParser = require('cookie-parser');

const loadSession = (sid, callback) => {
  sessionStore.load(sid, (err, session) => {
    if (arguments.length === 0) {
      return callback(null, null);
    }

    return callback(null, session);
  });
};

const loadUser = (session, callback) => {
  if (!session.user) {
    logger.debug('Session %s is anonymous', session.id);
    return callback(null, null);
  }

  logger.debug('Retrive user ', session.user);

  User.findById(session.user, (err, user) => {
    if (err) return callback(err);

    if (!user) {
      return callback(null, null);
    }

    console.log(`user findById result: ${user}`);

    callback(null, user);
  });
};

module.exports = function (server) {
  const io = require('socket.io').listen(server);

  io.set('origins', 'localhost:*');
  io.set('logger', logger);

  io.use((socket, next) => {
    const handshake = socket.request;

    async.waterfall([
      (callback) => {
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        const sidCookie = handshake.cookies[config.get('session:key')];
        const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

        loadSession(sid, callback);
      },
      (session, callback) => {
        if (!session) {
          callback(new HttpError(401, 'No session'));
        }

        handshake.session = session;

        loadUser(session, callback);
      },
      (user, callback) => {
        if (!user) {
          callback(new HttpError(403, 'Anonymous session may not connect'));
        }
        handshake.user = user;
        return next();
        // callback(null);
      }
    ], (err) => {
      if (!err) {
        // return callback(null, true);
        return next();
      }

      if (err instanceof HttpError) {
        return callback(null, false);
      }

      callback(err);
    });
  });

  io.sockets.on('connection', (socket) => {
    // console.log('------------------------------------', socket.request.user);
    const { username } = socket.request.user;
    // const username = ''; //socket.handshake.user.get('username');
    console.log('USERNAME: ', username);
    socket.broadcast.emit('join', username);

    socket.on('message', (text, cb) => {
      console.log(text);

      socket.broadcast.emit('message', username, text);
      cb(text);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('leave', username);
    });
  });

  return io;
};
