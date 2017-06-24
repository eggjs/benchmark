# benchmark

[![build status][travis-image]][travis-url]

[travis-image]: https://img.shields.io/travis/eggjs/benchmark.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/benchmark

egg benchmark

## Commands

* `npm test` to run all the benchmarks and store the results in `stats.csv` (requires `wrk`)
* `./plot.sh` to compare performance between the latest releases of Node.js v7.x, v8.x, rc, nightly and v8-canary (requires `wrk` and `nvm`), then open `plot/index.html` to see the results
  * Requires AJAX privilege to load data from `plot/all.csv`, you can run `python -m SimpleHTTPServer` then visit `http://localhost:8000/plot/` (or use any other static server) if you don't want to tweak browser settings

## Default Middleware

- egg default enable 15 middlewares (6 security middlewares enable by default)
- enable router
- passport has 17 middlewares (15 default, 2 passport middlewares)

## Scenes

- Hello World: `$ EGG_SERVER_ENV=prod node benchmarks/simple/dispatch.js`
- nunjucks: `$ EGG_SERVER_ENV=prod node benchmarks/simple_view/dispatch.js`
- Empty passport: `$ EGG_SERVER_ENV=prod node benchmarks/simple_passport/dispatch.js`

## Scripts

- koa1: `wrk http://127.0.0.1:7002/ -d 10 -c 50 -t 8`
- koa2: `wrk http://127.0.0.1:7004/ -d 10 -c 50 -t 8`
- egg: `wrk http://127.0.0.1:7001/ -d 10 -c 50 -t 8`

## Server

- CPU x4: Intel(R) Xeon(R) CPU E5-2650 v2 @ 2.60GHz
- Mem: 10G

## Known issues

- [ensure csrf token exists](https://github.com/eggjs/egg-security/blob/master/app/extend/context.js#L75): It's cause get and set cookie on every request.
  ![image](https://cloud.githubusercontent.com/assets/156269/22675417/8fd55b44-ed20-11e6-8ac8-77a791e558dd.png)

## egg versions benchmark

- [plots view](https://fengmk2.com/egg/benchmark/)

### Hello World

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.1.0 | 7.9.0 | 11004 | 11200
1.0.0-rc.1 | 7.6.0 | 11069 | 11296
0.12.0 | 7.6.0 | 10899 | 11122
0.12.0 | 6.9.5 | 8880 | -
0.11.0 | 6.9.5 | 8889 | -
0.10.0 | 6.9.5 | 8470 | -
0.2.0 | 6.9.5 | 8917 | -

### nunjucks

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.1.0 | 7.9.0 | 6092 | 6121
1.0.0-rc.1 | 7.6.0 | 6278 | 6350
0.12.0 | 7.6.0 | 7216 | 7371
0.12.0 | 6.9.5 | 5967 | -
0.11.0 | 6.9.5 | 6057 | -
0.10.0 | 6.9.5 | 5681 | -
0.2.0 | 6.9.5 | 6732 | -

### ejs

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.1.0 | 7.9.0 | 6916 | 6985
1.0.0-rc.1 | 7.6.0 | 7333 | 7372

### passport

- egg-passport: 1.0.0

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.1.0 | 7.9.0 | 10117 | 10556
1.0.0-rc.1 | 7.6.0 | 10039 | 10438
0.12.0 | 7.6.0 | 9981 | 10436
0.12.0 | 6.9.5 | 7943 | -

## Last Results

- node: 7.9.0
- koa1: 1.4.0
- koa2: 2.2.0
- egg: 1.1.0

Scene | QPS | Scene | QPS
---   | --- | ---   | ---
koa1 Hello World | 18216 | koa2 Hello World | 21836
egg Hello World | 11004 | egg Hello World (Async Await) | 11200
egg Hello Passport | 10117 | egg Hello Passport (Async Await) | 10556
koa1 nunjucks | 11807 | koa2 nunjucks | 13583
egg nunjucks | 6092 | egg nunjucks (Async Await) | 6121
egg ejs | 6916 | egg ejs (Async Await) | 6985


### Last Details

`stats.csv`
