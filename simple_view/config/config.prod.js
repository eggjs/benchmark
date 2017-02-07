'use strict';

const path = require('path');

Object.assgin(exports, require('../../config'));

exports.keys = 'foo';

exports.logger = {
  dir: path.join(__dirname, '../logs'),
};
