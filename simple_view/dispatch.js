const egg2 = require('egg2');
const egg1 = require('egg1');
const cluster = require('cluster');

let workers = Number(process.argv[2] || require('os').cpus().length);
if (workers > 4) {
  workers = 4;
}

if (cluster.isMaster) {
  egg1.startCluster({
    workers,
    baseDir: __dirname,
    port: 7003,
    framework: 'egg1',
  });

  egg2.startCluster({
    workers,
    baseDir: __dirname,
    port: 7004,
    framework: 'egg2',
  });
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
} else {
  require('./koa1');
  require('./koa2');
}
