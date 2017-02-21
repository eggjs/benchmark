'use strict';

module.exports = app => {
  app.get('/nunjucks', 'home.nunjucks');
  app.get('/ejs', 'home.ejs');
  app.get('/aa', 'async.index');
};
