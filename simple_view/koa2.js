'use strict';

const Koa = require('koa');
const nunjucks = require('nunjucks');
const path = require('path');
const router = require('koa-router')();

const app = new Koa();
let n = 15;

while (n--) {
  app.use(async (ctx, next) => {
    await next();
  });
}

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

router.get('/', async (ctx) => {
  ctx.body = await render('nunjucks/home.html', {
    user: {
      name: 'fookoa',
    },
    title: 'koa2 view example',
  });
});

app.use(router.routes())
  .use(router.allowedMethods());

console.log('koa2 app listen on 7004');
app.listen(7004);
