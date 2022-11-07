const Koa = require('egg-core/node_modules/koa');
const router = require('egg-core/node_modules/koa-router')();

const app = new Koa();
let n = 15;

while (n--) {
  app.use(async (ctx, next) => {
    await next();
  });
}

router.get('/', async ctx => {
  ctx.body = 'Hello World, koa2\n';
});

app.use(router.routes())
  .use(router.allowedMethods());

console.log('koa2 app listen on 7002');
app.listen(7002);
