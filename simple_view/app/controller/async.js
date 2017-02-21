'use strict';

module.exports = app => {
  return class Async extends app.Controller {
    async index() {
      await this.ctx.render('nunjucks/home.html', {
        user: {
          name: 'foobar',
        },
        title: 'egg async view example',
      });
    }
  };
};
