var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, {
	auto_reconnect: true
});
var db = new mongodb.Db('UIManager', server, {
	safe: true
});

exports.insertOne = function(dbName) {

}

db.open(function(err, db) {
	if (!err) {
		var collection = db.collection('test_project');
		collection.insert({
			hello: 'world_no_safe'
		});
		setTimeout(function() {
			// Fetch the document
			collection.findOne({
				hello: 'world_no_safe'
			}, function(err, item) {
				assert.equal(null, err);
				assert.equal('world_no_safe', item.hello);
				db.close();
			})
		}, 100);
	} else {
		console.log(err);
	}
});