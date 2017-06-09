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
    'koa@1',
    'koa-router@5',
  ],
  exclude: [
    './test/fixtures',
    './dist',
    './wrk',
  ],
  registry: 'https://r.cnpmjs.org',
};
