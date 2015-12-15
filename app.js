var path = require('path');

var express = require('express');
var app = express();

var createRouter = require(path.resolve(__dirname, './create'));
var readRouter = require(path.resolve(__dirname, './read'));
var updateRouter = require(path.resolve(__dirname, './update'));
var deleteRouter = require(path.resolve(__dirname, './delete'));

var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');

app.use(morgan('short'));
app.use(compression());

app.post('*', bodyParser.urlencoded({
	extended: true,
	limit: '10mb'
}));
app.put('*', bodyParser.urlencoded({
	extended: true,
	limit: '10mb'
}));
app.post('*', bodyParser.json({
	limit: '10mb'
}));
app.put('*', bodyParser.json({
	limit: '10mb'
}));

// Home
app.get('/', (req, res) => {
	res.json('hello world');
});

// Create
app.post('*', createRouter);

// Read
app.get('*', readRouter);

// Update
app.put('*', updateRouter);

// Delete
app.delete('*', deleteRouter);

app.listen(1688);
