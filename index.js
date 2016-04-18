'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cloudinary = require('cloudinary');

var _cloudinary2 = _interopRequireDefault(_cloudinary);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _project = require('./models/project');

var _project2 = _interopRequireDefault(_project);

var _expressConfig = require('./express-config');

var _expressConfig2 = _interopRequireDefault(_expressConfig);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();


_cloudinary2.default.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

_mongoose2.default.connect(process.env.MONGOLAB_URI, {}, function (err) {
  if (err) {
    console.log('Connection Error to MongoDB hosted on MongoLab: \n', err);
  } else {
    console.log('Successfully Connected to MongoDB hosted on MongoLab');
  }
});

(0, _expressConfig2.default)(app);

// ***** Mongoosastic (mongoose + Elasticsearch) setup *****

_project2.default.createMapping(function (err, mapping) {
  if (err) {
    console.log('*** Error creating mapping \n');
    console.log(err);
  } else {
    console.log('*** Mapping created \n');
    console.log(mapping);
  }
});

var stream = _project2.default.synchronize();
var count = 0;

stream.on('data', function () {
  count++;
});

stream.on('close', function () {
  console.log('Indexed ' + count + ' documents');
});

stream.on('error', function (err) {
  console.log('Error occured: \n', err);
});

(0, _routes2.default)(app);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log('Server Started at 192.168.33.10:' + PORT);
});