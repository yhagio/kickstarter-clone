'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _expressConfig = require('./express-config');

var _expressConfig2 = _interopRequireDefault(_expressConfig);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

(0, _expressConfig2.default)(app);

(0, _routes2.default)(app);

// Start
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log('Server Started at 192.168.33.10:' + PORT);
});