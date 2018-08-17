const { User } = require('../models/user');

const renderRegistrationPage = (req, res) => {
  res.render('registration');
};

const addNewUser = (req, res, next) => {
  console.log("registration POST");
  const {
    login,
    email,
    password,
    repeatedPassword,
  } = req.body;

  User.addNewUser(req.body, (err, user) => {
    if (err) throw err;

    res.status(200);
    res.json(user);
    res.end();

    console.log('addNewUser!!', user);
  });
};

exports.get = renderRegistrationPage;
exports.post = addNewUser;
