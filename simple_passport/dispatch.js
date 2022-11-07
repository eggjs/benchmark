const egg3 = require('egg3');
const egg2 = require('egg2');
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

egg2.startCluster({
  workers,
  baseDir: __dirname,
  port: 7002,
  framework: 'egg2',
});

egg3.startCluster({
  workers,
  baseDir: __dirname,
  port: 7003,
  framework: 'egg3',
});

egg3.startCluster({
  startMode: 'worker_threads',
  workers: 1,
  ports: [ 7004 ],
  baseDir: __dirname,
  framework: 'egg3',
});
