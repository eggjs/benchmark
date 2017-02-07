'use strict';

exports.alinode = {
  enable: !!process.env.ALINODE_ENABLE,
  appid: process.env.ALINODE_APPID,
  server: process.env.ALINODE_SERVER,
  secret: process.env.ALINODE_SECRET,
};
