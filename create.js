var express = require('express');
var router = express.Router();

router.use((req, res) => {
	var jsonparsed = JSON.parse(req.query.jsonstring);

	// If data is not an array
	if (jsonparsed.length === undefined) {
		// If data is an empty object
		if (Object.keys(jsonparsed).length === 0) {
			res.json(null);
			return;
		}
		// If data is an object
		jsonparsed = [jsonparsed];
	}
	req.db.collection('post').insertMany(jsonparsed, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
