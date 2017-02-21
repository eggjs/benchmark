'use strict';

module.exports = app => {
  return class Home extends app.Controller {
    * nunjucks() {
      yield this.ctx.render('nunjucks/home.html', {
        user: {
          name: 'foobar',
        },
        title: 'egg view example',
      });
    }

    * ejs() {
      yield this.ctx.render('ejs/home.ejs', {
        user: {
          name: 'foobar',
        },
        title: 'egg view example',
      });
    }
  };
};
