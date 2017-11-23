var winston = require('winston');

var logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			colorize: true,
			format: winston.format.json(),
			level: "debug"
		})
	]
});

module.exports = logger;