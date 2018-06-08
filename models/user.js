const crypto = require('crypto');
const async = require('async');
const util = require('util');
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

UserSchema.statics.authorize = function(login, password, callback) {
	let User = this;
	console.log("AAAAAAAAAAAAAA", login, password);
	// console.log(async.waterfall);
	// console.log(User);
	async.waterfall([
		function(callback) {
			console.log("SSSSSSSSS");
			User.findOne({username: login}, callback);
		},
		function(user, callback) {
			console.log("user", user);
			if(user) {
				if(user.checkPassword(password)) {
					callback(null, user);
				} else {
					callback(new AuthError("Password is not correct."))
				}
			} else {
				const notExist = "User not exist";
				console.log("sssss");
				callback(null, notExist);
				// res.set('Content-Type', 'text/json');
				// res.render("login", {"err" : "User not exist"});
				// res.send({"err" : "User not exist"});
				// res.redirect('/login');
				// res.end();
			}
		}
	], callback);
}

UserSchema.statics.addNewUser = function(userData, callback) {
	let User = this;

	const {
		login,
		email,
		password,
		repeatedPassword,
	} = userData;

	async.waterfall([
		function (callback) {
			User.findOne({ username: login }, callback);
		},
		function(user, callback) {
			if (!user) {
				if( password === repeatedPassword ) {
					const newUser = new User({
						username: login,
						password: password,
					});
					newUser.save(function(err) {
						if (err) throw err;
					})
				} else {
					const err = 'Password and password repetition is not equal';
					callback(null, err);
				}
			}
			console.log("user", user);
			callback(user);
		}
	], callback);
} 

exports.User = mongoose.model('User', UserSchema);

function AuthError(message) {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, AuthError);

	this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = "AuthError";

exports.AuthError = AuthError;