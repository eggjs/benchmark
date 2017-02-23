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

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.0.0-rc.1 | 7.6.0 | 11069 | 11296
0.12.0 | 7.6.0 | 10899 | 11122
0.12.0 | 6.9.5 | 8880 | -
0.11.0 | 6.9.5 | 8889 | -
0.10.0 | 6.9.5 | 8470 | -
0.2.0 | 6.9.5 | 8917 | -

### nunjucks

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.0.0-rc.1 | 7.6.0 | 6278 | 6350
0.12.0 | 7.6.0 | 7216 | 7371
0.12.0 | 6.9.5 | 5967 | -
0.11.0 | 6.9.5 | 6057 | -
0.10.0 | 6.9.5 | 5681 | -
0.2.0 | 6.9.5 | 6732 | -

### ejs

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.0.0-rc.1 | 7.6.0 | 7333 | 7372

### passport

- egg-passport: 1.0.0

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
1.0.0-rc.1 | 7.6.0 | 10039 | 10438
0.12.0 | 7.6.0 | 9981 | 10436
0.12.0 | 6.9.5 | 7943 | -

## Last Results

- node: 7.6.0
- koa: 1.2.5
- toa: 2.6.0
- egg: 1.0.0-rc.1

Scene | QPS | Scene | QPS
---   | --- | ---   | ---
koa Hello World | 18538 | toa Hello World | 18405
egg Hello World | 11069 | egg Hello World (Async Await) | 11296
egg Hello Passport | 10039 | egg Hello Passport (Async Await) | 10438
koa nunjucks | 12093 | toa nunjucks | 11548
egg nunjucks | 6278 | egg nunjucks (Async Await) | 6350
egg ejs | 7333 | egg ejs (Async Await) | 7372


### Last Details

#### Hello World

```bash
------- koa hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.63ms    1.11ms  52.19ms   97.91%
    Req/Sec     2.33k   208.22     2.58k    94.88%
  185463 requests in 10.00s, 27.95MB read
Requests/sec:  18538.45
Transfer/sec:      2.79MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.97ms    2.35ms  49.13ms   93.08%
    Req/Sec     2.31k   210.46     2.83k    76.88%
  184319 requests in 10.01s, 31.11MB read
Requests/sec:  18405.91
Transfer/sec:      3.11MB

------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.37ms    1.30ms  62.30ms   95.35%
    Req/Sec     1.39k    79.25     1.49k    93.75%
  110808 requests in 10.01s, 37.20MB read
Requests/sec:  11069.34
Transfer/sec:      3.72MB

------- egg hello (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.27ms    1.01ms  51.45ms   95.65%
    Req/Sec     1.42k    57.97     1.90k    81.50%
  113072 requests in 10.01s, 37.96MB read
Requests/sec:  11296.12
Transfer/sec:      3.79MB
```

#### nunjucks

```bash
------- koa view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.13ms    2.27ms  69.02ms   92.58%
    Req/Sec     1.52k   164.32     1.74k    86.25%
  120992 requests in 10.00s, 302.43MB read
Requests/sec:  12093.28
Transfer/sec:     30.23MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.68ms    3.67ms  82.82ms   90.79%
    Req/Sec     1.45k   236.68     1.85k    59.12%
  115684 requests in 10.02s, 291.26MB read
Requests/sec:  11548.25
Transfer/sec:     29.08MB

------- egg nunjucks view -------

Running 10s test @ http://127.0.0.1:7001/nunjucks
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.92ms    4.42ms 118.91ms   91.28%
    Req/Sec   788.99     91.40     0.95k    72.00%
  62885 requests in 10.02s, 169.36MB read
Requests/sec:   6278.45
Transfer/sec:     16.91MB

------- egg ejs view -------

Running 10s test @ http://127.0.0.1:7001/ejs
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.65ms    2.52ms  58.55ms   92.39%
    Req/Sec     0.92k    66.77     1.21k    65.00%
  73450 requests in 10.02s, 199.28MB read
Requests/sec:   7333.62
Transfer/sec:     19.90MB

------- egg nunjucks view (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/nunjucks-aa
  8 threads and 50 connections

  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.74ms    3.21ms  61.01ms   91.10%
    Req/Sec   798.13     49.01     1.06k    77.75%
  63630 requests in 10.02s, 171.73MB read
Requests/sec:   6350.39
Transfer/sec:     17.14MB

------- egg ejs view (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/ejs-aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.61ms    2.29ms  53.62ms   92.26%
    Req/Sec     0.93k    43.47     1.17k    84.62%
  73832 requests in 10.01s, 200.74MB read
Requests/sec:   7372.62
Transfer/sec:     20.05MB
```

#### Hello Passport

```bash
------- egg passport -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.85ms    2.35ms  87.95ms   97.51%
    Req/Sec     1.27k   300.78     9.00k    96.75%
  101402 requests in 10.10s, 33.85MB read
Requests/sec:  10039.71
Transfer/sec:      3.35MB

------- egg passport (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.61ms  815.73us  42.46ms   93.47%
    Req/Sec     1.31k    45.24     1.57k    78.50%
  104486 requests in 10.01s, 35.27MB read
Requests/sec:  10438.46
Transfer/sec:      3.52MB
```
