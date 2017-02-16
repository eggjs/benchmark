'use strict';

module.exports = app => {
  return class Async extends app.Controller {
    async index() {
      this.ctx.body = 'Hello Async, egg\n';
    }
  };
};
