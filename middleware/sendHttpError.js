module.exports = function(options) {
	const { app } = options;
	let development = app.get('env') === 'development';

	return function(req, res, next) {
		res.sendHttpError = function(error) {
			res.status(error.status || 500);
			res.setHeader('Content-Type', 'text/html');

			if(development) {
				res.render("error", {
      				message: error.message,
      				stack: error.stack,
      				status: error.status
    			});
			} else {
				res.render("error", {
			    	message: error.message,
			    	status: error.status
				});
			}
		}
		next();
	}
}
