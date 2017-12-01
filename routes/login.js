exports.get = function(req, res) {
	console.log("login");
	res.render('login');
}

exports.post = function(req, rex, next) {
	console.log("login POST");
}