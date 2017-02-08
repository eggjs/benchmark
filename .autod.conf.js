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
  ],
  devdep: [
    'autod',
    'eslint',
    'eslint-config-egg',
    'webstorm-disable-index',
    'nunjucks',
    'koa',
    'koa-router',
    'toa',
    'toa-router',
  ],
  semver: [
    'koa@1',
    'koa-router@5',
    'toa@2',
    'toa-router@2',
  ],
  exclude: [
    './test/fixtures',
    './dist',
    './wrk',
  ],
  registry: 'https://r.cnpmjs.org',
};
