const os = require('os');

const startKoa2 = require('./start_koa2');

// node dispatch.js [egg4|egg3|egg2|egg1|koa] [port] [reusePort] [startMode] [workers]
const framework = process.argv[2] || 'egg4';
const port = Number(process.argv[3] || 7001);
let reusePort = process.argv[4] === 'true';
// process, worker_threads
const startMode = process.argv[5] || 'process';
let workers = Number(process.argv[6] || os.availableParallelism());
if (workers > 4) {
  workers = 4;
}

if (startMode === 'worker_threads') {
  reusePort = true;
}

console.log('framework: %s, port: %s, reusePort: %s, workers: %s', framework, port, reusePort, workers);
console.log('os version: %s, availableParallelism: %s', os.version(), os.availableParallelism());

if (framework === 'koa2') {
  startKoa2(workers, port);
} else {
  const egg = require(framework);
  egg.startCluster({
    startMode,
    workers,
    baseDir: __dirname,
    port,
    framework,
    reusePort,
  });
}
