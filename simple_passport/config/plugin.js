'use strict';

exports.alinode = {
  enable: !!process.env.ALINODE_ENABLE,
  package: 'egg-alinode',
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};
