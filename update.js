var express = require('express');
var router = express.Router();

router.use((req, res) => {
	if (req.query.filter === undefined) {
		req.query.filter = {};
	}
	if (req.query.filter._id !== undefined) {
		req.query.filter._id = req.objectId(req.query.filter._id);
	}
	req.db.collection('post').updateMany(req.query.filter, req.query.updateOp, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
