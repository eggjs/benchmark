'use strict';

module.exports = app => {
  console.log('egg app core middlewares: %d, app middlewares: %d',
    app.config.coreMiddlewares.length, app.config.appMiddlewares.length);
  require('./koa');
  require('./toa');
};
