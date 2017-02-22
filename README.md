# benchmark

[![build status][travis-image]][travis-url]

[travis-image]: https://img.shields.io/travis/eggjs/benchmark.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/benchmark

egg benchmark

## Default Middleware

- egg default enable 15 middlewares (6 security middlewares enable by default)
- enable router
- passport has 17 middlewares (15 default, 2 passport middlewares)

## Scenes

- Hello World: `$ EGG_SERVER_ENV=prod node benchmarks/simple/dispatch.js`
- nunjucks: `$ EGG_SERVER_ENV=prod node benchmarks/simple_view/dispatch.js`
- Empty passport: `$ EGG_SERVER_ENV=prod node benchmarks/simple_passport/dispatch.js`

## Scripts

- koa: `wrk http://127.0.0.1:7002/ -d 10 -c 50 -t 8`
- toa: `wrk http://127.0.0.1:7003/ -d 10 -c 50 -t 8`
- egg: `wrk http://127.0.0.1:7001/ -d 10 -c 50 -t 8`

## Server

- CPU x4: Intel(R) Xeon(R) CPU E5-2650 v2 @ 2.60GHz
- Mem: 10G

## Known issues

- [ensure csrf token exists](https://github.com/eggjs/egg-security/blob/master/app/extend/context.js#L75): It's cause get and set cookie on every request.
  ![image](https://cloud.githubusercontent.com/assets/156269/22675417/8fd55b44-ed20-11e6-8ac8-77a791e558dd.png)


## egg versions benchmark

### Hello World

egg version | QPS Generator | Async Await
--- | --- | ---
0.12.0 | 8880 | -
0.11.0 | 8889 | -
0.10.0 | 8470 | -
0.2.0 | 8917 | -

### nunjucks

egg version | QPS Generator | Async Await
--- | --- | ---
0.12.0 | 5967 | -
0.11.0 | 6057 | -
0.10.0 | 5681 | -
0.2.0 | 6732 | -

### passport

- egg-passport: 0.0.4

egg version | QPS Generator | Async Await
--- | --- | ---
0.12.0 | 7943 | ---

## Last Results

- node: 6.9.5
- koa: 1.2.5
- toa: 2.6.0
- egg: 0.12.0

Scene | QPS | Avg RT (ms) | Stdev RT | Max RT
---   | --- | ---         | ---      | ---
koa Hello World | 14423 | 3.40 | 2.06 | 82.80
toa Hello World | 17002 | 3.16 | 2.24 | 33.68
egg Hello World | 8880 | 5.44 | 1.37 | 62.04
egg Hello World (Async Await) | 8880 | 5.44 | 1.37 | 62.04
egg Hello Passport | 7943 | 6.21 | 3.29 | 111.13
egg Hello Passport (Async Await) | 7943 | 6.21 | 3.29 | 111.13
koa nunjucks | 9620 | 5.19 | 3.72 | 121.49
toa nunjucks | 10255 | 5.08 | 3.15 | 60.89
egg nunjucks | 5967 | 8.31 | 4.68 | 114.16
egg nunjucks (Async Await) | 5967 | 8.31 | 4.68 | 114.16

### Last Details

#### Hello World

```bash
------- koa hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.40ms    2.06ms  82.80ms   97.89%
    Req/Sec     1.82k   324.81     8.53k    96.76%
  145678 requests in 10.10s, 21.95MB read
Requests/sec:  14423.75
Transfer/sec:      2.17MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.16ms    2.24ms  33.68ms   93.13%
    Req/Sec     2.14k   177.99     2.43k    74.88%
  170140 requests in 10.01s, 28.72MB read
Requests/sec:  17002.29
Transfer/sec:      2.87MB

------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.44ms    1.37ms  62.04ms   97.57%
    Req/Sec     1.12k    60.89     1.33k    90.12%
  88902 requests in 10.01s, 29.84MB read
Requests/sec:   8880.09
Transfer/sec:      2.98MB
```

#### nunjucks

```bash
------- koa view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.19ms    3.72ms 121.49ms   95.16%
    Req/Sec     1.21k   134.44     1.60k    85.36%
  96338 requests in 10.01s, 240.80MB read
Requests/sec:   9620.69
Transfer/sec:     24.05MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.08ms    3.15ms  60.89ms   91.60%
    Req/Sec     1.29k   137.54     1.63k    73.38%
  102683 requests in 10.01s, 258.53MB read
Requests/sec:  10255.79
Transfer/sec:     25.82MB

------- egg view -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.31ms    4.68ms 114.16ms   92.01%
    Req/Sec   750.17     79.98     0.89k    81.00%
  59794 requests in 10.02s, 160.52MB read
Requests/sec:   5967.45
Transfer/sec:     16.02MB
```

#### Hello Passport

```bash
------- egg passport -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.21ms    3.29ms 111.13ms   98.48%
    Req/Sec     1.00k   107.54     1.19k    93.75%
  79554 requests in 10.01s, 26.55MB read
Requests/sec:   7943.62
Transfer/sec:      2.65MB
```
