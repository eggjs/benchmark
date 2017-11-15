'use strict';

const koa = require('koa');
const nunjucks = require('nunjucks');
const path = require('path');
const router = require('koa-router')();

const app = koa();
let n = 15;

while (n--) {
  app.use(function* (next) {
    yield next;
  });
}

app.use(router.routes());

const options = {
  noCache: false,
};
const viewPaths = path.join(__dirname, 'app/view');
const engine = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewPaths, options), options);

function render(name, locals) {
  return new Promise((resolve, reject) => {
    engine.render(name, locals, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

router.get('/', function* () {
  this.body = yield render('nunjucks/home.html', {
    user: {
      name: 'fookoa',
    },
    title: 'koa1 view example',
  });
});

console.log('koa1 app listen on 7001');
app.listen(7001);
