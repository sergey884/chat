const crypto = require('crypto');
const mongoose = require('../libs/mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	createDate: {
		type: Date,
		default: Date.now
	}
});

UserSchema.methods.encryptPassword = function (password) { 
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

UserSchema
	.virtual('password')
	.set(function (password) {
		this._password = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password)
	})
	.get(() => this._password)

UserSchema.methods.checkPassword = function(password) { 
	return this.encryptPassword(password) === this.hashedPassword;
}

exports.User = mongoose.model('User', UserSchema);