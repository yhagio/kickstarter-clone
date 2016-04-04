"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getDayTilEnd = exports.getDayTilEnd = function getDayTilEnd(endDate) {
  var timeDiff = Math.abs(new Date(endDate).getTime() - new Date().getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};