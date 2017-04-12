'use strict';

const Koa = require('koa');
const router = require('koa-router')();

const app = new Koa();
let n = 15;

while (n--) {
  app.use(async (ctx, next) => {
    await next();
  });
}

router.get('/', async (ctx) => {
  ctx.body = 'Hello World, koa2\n';
});

app.use(router.routes())
  .use(router.allowedMethods());

console.log('koa2 app listen on 7004');
app.listen(7004);
