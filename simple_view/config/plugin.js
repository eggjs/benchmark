'use strict';

exports.view = {
  enable: true,
  package: 'egg-view-nunjucks',
};

exports.alinode = {
  enable: !!process.env.ALINODE_ENABLE,
  package: 'egg-alinode',
};
