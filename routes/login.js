const { User, AuthError } = require('../models/user');
const async = require('async');
const { HttpError } = require('../error');

exports.get = function (req, res) {
  res.render('login');
};

const checkAuthorization = (req, res, next) => {
  const {
    login,
    password,
  } = req.body;

  User.authorize(login, password, (err, user) => {
    if (typeof user === 'string') {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ err: user });
      res.end();
      return;
    }

    if (err) {
      if (err instanceof AuthError) {
        return next(new AuthError(err.message));
      }
      return next(err);
    }

    const { username } = user;
    req.session.user = user._id;
    res.set('Content-Type', 'application/json');
    res.send({ username });
    // res.redirect('chat');
  });
};

exports.post = checkAuthorization;
