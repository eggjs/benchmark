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
  ],
  semver: [
    'koa@1',
    'koa-router@5',
  ],
  exclude: [
    './test/fixtures',
    './dist',
    './wrk',
  ],
  keep: [
    'egg',
    'egg-core',
  ],
};
