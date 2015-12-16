var express = require('express');
var router = express.Router();

router.use((req, res) => {
	req.db.collection('post').find(req.query).toArray((err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = router;
