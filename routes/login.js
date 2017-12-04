const { User, AuthError } = require('../models/user');
const async = require('async');
const { HttpError } = require('../error');

exports.get = function(req, res) {
	console.log("login--GET");
	res.render('login');
}

exports.post = function(req, res, next) {
	const {
		login,
		password
	} = req.body;
	console.log("login POST", login, password);
	// console.log("User.authoriz", AuthError);

	User.authorize(login, password, function(err, user) {
		console.log("AuthError", user);
		if(typeof user === 'string') {
			res.set('Content-Type', 'application/json');
			res.status(200).json({ "err" : user });
			// next();
			// res.render("login");
			// res.end();
		}

		if(err) {
			if(err instanceof AuthError) {
				return next(new AuthError(err.message));
			} else {
				return next(err);
			}
		}
		
		// res.end();

	})
}