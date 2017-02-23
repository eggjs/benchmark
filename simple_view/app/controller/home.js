'use strict';

module.exports = app => {
  return class Home extends app.Controller {
    * nunjucks() {
      yield this.ctx.render('nunjucks/home.html', {
        user: {
          name: 'foobar',
        },
        title: 'egg nunjucks view example',
      });
    }

    * ejs() {
      yield this.ctx.render('ejs/home.ejs', {
        user: {
          name: 'foobar',
        },
        title: 'egg ejs view example',
      });
    }
  };
};
