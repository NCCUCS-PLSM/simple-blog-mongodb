var express = require('express');
var router = express.Router();

router.use((req, res) => {
	if (req.query._id !== undefined) {
		req.query._id = req.objectId(req.query._id);
	}
	req.db.collection('post').find(req.query).toArray((err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
