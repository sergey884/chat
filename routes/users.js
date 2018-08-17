const { User } = require('../models/user');
const { HttpError } = require('../error');

module.exports.get = function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) return next(err);
    if (!user) {
      return next(new HttpError(404, "User not found"));
    }
    res.json(user);
  })
};
