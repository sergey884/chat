/*const MongoClient = require('mongodb').MongoClient;
const { format } = require('util');

const url = "mongodb://127.0.0.1:27017/chat";

MongoClient.connect(url, function(err, db) {
	if( err ) throw err;

	const collection = db.collection('users');

	collection.count(function( err, count ) {
		console.log(format("COUNT = %s", count));
	});
	// console.log(collection);
});*/

function open(callback) {
	mongoose.connect.on("open", callback);
}

function dropDatabase(callback) {
	const db = mongoose.connection.db;
	db.dropDatabase(callback);
}

function createUsers() {

}

function close(callback) {
	mongoose.disconnect(callback);
}

const { User } = require('./models/user');

const user = new User({
	username: "Tester3",
	password: "Tester3"
});

user.save((err, user, affected) => {
	if(err) throw err;

	console.log(user);
})