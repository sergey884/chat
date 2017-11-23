const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(
	config.get("mongoose:url"),
	config.get("mongoose:options")
);

mongoose.Promise - global.Promise;

module.exports = mongoose;