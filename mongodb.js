var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var connectingDB = new Promise((resolve, reject) => {
	var url = 'mongodb://localhost:27017/blog';
	MongoClient.connect(url, (err, db) => {
		if (err) {
			reject(err);
		} else {
			resolve(db);
		}
	});
});

module.exports = {
	connectingDB: connectingDB,
	objectId: ObjectId
};
