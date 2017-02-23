'use strict';

module.exports = app => {
  app.get('/nunjucks', 'home.nunjucks');
  app.get('/ejs', 'home.ejs');
  app.get('/nunjucks-aa', 'async.nunjucks');
  app.get('/ejs-aa', 'async.ejs');
};
