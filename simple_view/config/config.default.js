const path = require('path');

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

exports.security = {
  csrf: false,
};
