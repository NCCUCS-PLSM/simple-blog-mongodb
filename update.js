var express = require('express');
var router = express.Router();

router.use((req, res) => {
	req.db.collection('post').updateMany(req.query.filter, req.query.updateOp, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
