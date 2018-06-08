const { User } = require('../models/user');

exports.get = function(req, res) {
	res.render('registration');
}

exports.post = function(req, res, next) {
	console.log("registration POST");
	const {
		login,
		email,
		password,
		repeatedPassword,
	} = req.body;

	User.addNewUser(req.body, function(err, user) {
		console.log('addNewUser', user);
	});
}