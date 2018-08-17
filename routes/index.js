const express = require('express');
const { HttpError } = require('../error');
const login = require('./login');
const users = require('./users');
const registration = require('./registration');
const chat = require('./chat');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat' });
});

router.get('/login', login.get);

router.post('/login', login.post);

router.get('/registration', registration.get);

router.post('/registration', registration.post);

router.get('/users/:id', users.get);

router.get('/chat', chat.get);

module.exports = router;
