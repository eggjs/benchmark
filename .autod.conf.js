'use strict';

module.exports = {
  write: true,
  prefix: '^',
  test: [
    'test',
    'benchmark',
  ],
  dep: [
    'egg-alinode',
    'egg-view-nunjucks',
    'egg-view-ejs',
    'egg-passport',
  ],
  devdep: [
    'autod',
    'eslint',
    'eslint-config-egg',
    'webstorm-disable-index',
    'nunjucks',
    'koa',
    'koa-router',
  ],
  semver: [
    'koa@2',
    'koa-router@7',
  ],
  exclude: [
    './test/fixtures',
    './dist',
    './wrk',
  ],
};
