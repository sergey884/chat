/*var express = require('express');
var router = express.Router();*/
const { User } = require('../models/user');
const { HttpError } = require('../error');

/* GET users listing. */
/*router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		if(err) return next(err);
		res.json(users)

	})
  // res.send('respond with a resource');
});
*/
module.exports.get = function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if(err) return next(err);
		if(!user) {
			return next(new HttpError(404, "User not found"));
		}
		res.json(user);
	})
}