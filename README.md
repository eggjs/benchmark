# benchmark

[![build status][travis-image]][travis-url]

[travis-image]: https://img.shields.io/travis/eggjs/benchmark.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/benchmark

egg benchmark

## Commands

* `npm test` to run all the benchmarks and store the results in `stats.csv` (requires `wrk`), also you can open `plot/index.html` to see the results
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

- koa1: `wrk http://127.0.0.1:7001/ -d 10 -c 50 -t 8`
- koa2: `wrk http://127.0.0.1:7002/ -d 10 -c 50 -t 8`
- egg1: `wrk http://127.0.0.1:7003/ -d 10 -c 50 -t 8`
- egg2: `wrk http://127.0.0.1:7004/ -d 10 -c 50 -t 8`

## Server

- MacBook Pro (Retina, 15-inch, Late 2013)
- 2 GHz Intel Core i7 (only use 4 core for benchmark)

## Known issues

- [ensure csrf token exists](https://github.com/eggjs/egg-security/blob/master/app/extend/context.js#L75): It's cause get and set cookie on every request.
  ![image](https://cloud.githubusercontent.com/assets/156269/22675417/8fd55b44-ed20-11e6-8ac8-77a791e558dd.png)

## [Last Results](https://eggjs.github.io/benchmark/plot/)
