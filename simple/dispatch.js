const egg3 = require('egg3');
const egg2 = require('egg2');
const egg1 = require('egg1');
const cluster = require('cluster');
const os = require('os');

let workers = Number(process.argv[2] || os.cpus().length);
if (workers > 4) {
  workers = 4;
}

if (cluster.isMaster) {
  console.log('os version: %s', os.version());
  console.log('egg-cluster version: %s', require('egg-cluster/package.json').version);

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

  egg3.startCluster({
    workers,
    baseDir: __dirname,
    port: 7005,
    framework: 'egg3',
  });

  egg3.startCluster({
    workers,
    baseDir: __dirname,
    port: 7008,
    framework: 'egg3',
    reusePort: true,
  });

  egg3.startCluster({
    startMode: 'worker_threads',
    workers: 1,
    ports: [ 7006 ],
    baseDir: __dirname,
    framework: 'egg3',
  });

  egg3.startCluster({
    startMode: 'worker_threads',
    workers,
    port: 7009,
    baseDir: __dirname,
    framework: 'egg3',
    reusePort: true,
  });

  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
} else {
  require('./koa2');
}
