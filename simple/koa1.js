// koa 1 need those versions
const koa = require('koa');
const router = require('koa-router')();

const app = koa();
let n = 15;

while (n--) {
  app.use(function* (next) {
    yield next;
  });
}

app.use(router.routes());

router.get('/', function* () {
  this.body = 'Hello World, koa1\n';
});

console.log('koa1 app listen on 7001');
app.listen(7001);
