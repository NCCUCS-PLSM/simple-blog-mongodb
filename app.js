var path = require('path');

var express = require('express');
var app = express();

var connectingDB = require(path.resolve(__dirname, './mongodb')).connectingDB;
var objectId = require(path.resolve(__dirname, './mongodb')).objectId;

var createRouter = require(path.resolve(__dirname, './create'));
var readRouter = require(path.resolve(__dirname, './read'));
var updateRouter = require(path.resolve(__dirname, './update'));
var deleteRouter = require(path.resolve(__dirname, './delete'));

var compression = require('compression');
var morgan = require('morgan');

connectingDB
	.then(db => {
		app.use(morgan('short'));

		app.use('/static', express.static(path.resolve(__dirname, './static')));
		app.get('/', (req, res) => {
			res.sendFile(path.resolve(__dirname, './static/blog.html'));
		});

		app.use(compression());
		app.use((req, res, next) => {
			req.db = db;
			req.objectId = objectId;
			next();
		});

		// Create
		app.post('/api', createRouter);

		// Read
		app.get('/api', readRouter);

		// Update
		app.put('/api', updateRouter);

		// Delete
		app.delete('/api', deleteRouter);

		app.listen(1688);
	});
