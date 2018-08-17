const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      format: winston.format.json(),
      level: 'debug',
    }),
  ],
});

module.exports = logger;
