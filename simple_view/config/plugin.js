'use strict';

exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.alinode = {
  enable: !!process.env.ALINODE_ENABLE,
  package: 'egg-alinode',
};
