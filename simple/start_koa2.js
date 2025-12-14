const cluster = require('cluster');

module.exports = function startKoa2(workers, port) {
  if (cluster.isPrimary) {
    for (let i = 0; i < workers; i++) {
      cluster.fork();
    }
  } else {
    require('./koa2')(port);
  }
};
