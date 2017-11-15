'use strict';

const egg = require('egg');
const egg1 = require('egg1');

let workers = Number(process.argv[2] || require('os').cpus().length);
if (workers > 4) {
  workers = 4;
}

egg1.startCluster({
  workers,
  baseDir: __dirname,
  framework: 'egg1',
  port: 7001,
});

egg.startCluster({
  workers,
  baseDir: __dirname,
  port: 7002,
});
