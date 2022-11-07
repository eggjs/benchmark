# benchmark

egg benchmark

## Commands

* `npm test` to run all the benchmarks and store the results in `stats.csv` (requires `wrk`), also you can open `plot/index.html` to see the results
* `./plot.sh` to compare performance between the latest releases of Node.js v7.x, v8.x, rc, nightly and v8-canary (requires `wrk` and `nvm`), then open `plot/index.html` to see the results
  * Requires AJAX privilege to load data from `plot/all.csv`, you can run `python -m SimpleHTTPServer` then visit `http://localhost:8000/plot/` (or use any other static server) if you don't want to tweak browser settings

## Default Middleware

- egg default enable 15 middlewares (6 security middlewares enable by default)
- enable router
- passport has 17 middlewares (15 default, 2 passport middlewares)
- csrf are disabled, because in most situation we won't caculate csrf token and set to cookie

## Scenes

- Hello World: `$ EGG_SERVER_ENV=prod node benchmarks/simple/dispatch.js`
- nunjucks: `$ EGG_SERVER_ENV=prod node benchmarks/simple_view/dispatch.js`
- Empty passport: `$ EGG_SERVER_ENV=prod node benchmarks/simple_passport/dispatch.js`

## Scripts

- koa1: `wrk http://127.0.0.1:7001/ -d 10 -c 50 -t 8`
- koa2: `wrk http://127.0.0.1:7002/ -d 10 -c 50 -t 8`
- egg1: `wrk http://127.0.0.1:7003/ -d 10 -c 50 -t 8`
- egg2: `wrk http://127.0.0.1:7004/ -d 10 -c 50 -t 8`
- egg3: `wrk http://127.0.0.1:7005/ -d 10 -c 50 -t 8`
- egg3 with worker_threads: `wrk http://127.0.0.1:7006/ -d 10 -c 50 -t 8`

## Server

- MacBook Pro (Retina, 15-inch, Late 2013)
- 2 GHz Intel Core i7 (only use 4 core for benchmark)

## CPU Profiler

![image](https://user-images.githubusercontent.com/985607/32961302-a6d1d506-cb8d-11e7-9273-160d8ba77da6.png)

## Known issues

- `Date.now()` cost a lot of CPU time(7%) in `meta` middleware and `CreateContext` method.

## Last Results

- [Visualization](https://eggjs.github.io/benchmark/plot/)
- [Statistics data](https://github.com/eggjs/benchmark/blob/master/plot/all.csv)
