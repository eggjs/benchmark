'use strict';

module.exports = app => {
  return class Async extends app.Controller {
    async nunjucks() {
      await this.ctx.render('nunjucks/home.html', {
        user: {
          name: 'foobar',
        },
        title: 'egg async nunjucks view example',
      });
    }

    async ejs() {
      await this.ctx.render('ejs/home.ejs', {
        user: {
          name: 'foobar',
        },
        title: 'egg async ejs view example',
      });
    }
  };
};
