'use strict';

module.exports = app => {
  return class Home extends app.Controller {
    * index() {
      yield this.ctx.render('home.html', {
        user: {
          name: 'foobar',
        },
        title: 'egg view example',
      });
    }
  };
};
