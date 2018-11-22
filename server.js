var path = require('path');
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var app = express();

// use logger
app.use(morgan('combined'));

// compress with gzip/deflate
app.use(compression());

// serve up static pages with max-age headers of 1 day
app.use(serveStatic('public', { 'index': ['index.html', 'index.htm'] }))

// body parsing middleware (for json responses)
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.json({ type: 'application/*+json' }))

// handle any errors
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// Render the app
app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname, '../public/index.html'));
});

// start server
var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log('Listening on ' + port);
});
