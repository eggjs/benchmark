'use strict';

const koa = require('koa');
const router = require('koa-router')();

const app = koa();
let n = 10;

while (n--) {
  app.use(function* (next) {
    yield next;
  });
}

app.use(router.routes());

router.get('/', function* () {
  this.body = 'Hello World, koa\n';
});

console.log('koa app listen on 7002');
app.listen(7002);
