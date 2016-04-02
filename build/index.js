'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();


app.use((0, _morgan2.default)('combined'));
app.use((0, _helmet2.default)());

app.route('/').get(function (req, res) {
  res.send({ 'greet': 'Hello' });
}).post(function (req, res) {
  console.log(req.body);
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log('Server Started at 192.168.33.10:' + PORT);
});