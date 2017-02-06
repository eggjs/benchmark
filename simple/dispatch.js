'use strict';

const egg = require('egg');

let workers = Number(process.argv[2] || require('os').cpus().length);
if (workers > 4) {
  workers = 4;
}

egg.startCluster({
  workers,
  baseDir: __dirname,
});
