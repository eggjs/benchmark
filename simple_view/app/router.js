module.exports = app => {
  app.get('/nunjucks', 'async.nunjucks');
  app.get('/ejs', 'async.ejs');
};
