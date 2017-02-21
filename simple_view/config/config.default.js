'use strict';

const path = require('path');

Object.assign(exports, require('../../config'));

exports.keys = 'foo';

exports.logger = {
  dir: path.join(__dirname, '../logs'),
};

exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.ejs': 'ejs',
  },
};
