# benchmark

[![build status][travis-image]][travis-url]

[travis-image]: https://img.shields.io/travis/eggjs/benchmark.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/benchmark

egg benchmark

## Default Middleware

- 15 middlewares (egg has 6 security middlewares enable by default)
- enable router

## Scenes

- Hello World: `$ EGG_SERVER_ENV=prod node benchmarks/simple/dispatch.js`
- nunjucks: `$ EGG_SERVER_ENV=prod node benchmarks/simple_view/dispatch.js`

## Scripts

- koa: `wrk http://remote-ip:7002/ -d 10 -c 50 -t 8`
- toa: `wrk http://remote-ip:7003/ -d 10 -c 50 -t 8`
- egg: `wrk http://remote-ip:7001/ -d 10 -c 50 -t 8`

## Server

- CPU x4: Intel(R) Xeon(R) CPU E5-2650 v2 @ 2.60GHz
- Mem: 10G

## Known issues

- [ensure csrf token exists](https://github.com/eggjs/egg-security/blob/master/app/extend/context.js#L75): It's cause get and set cookie on every request.
  ![image](https://cloud.githubusercontent.com/assets/156269/22675417/8fd55b44-ed20-11e6-8ac8-77a791e558dd.png)


## egg versions benchmark

### Hello World

- 👍 Up
- 👎 Down

egg version | QPS
--- | ---
0.12.0 | 8909 👍
0.11.0 | 8889
0.10.0 | 8470
0.2.0 | 8917

### nunjucks

egg version | QPS
--- | ---
0.12.0 | 6131 👍
0.11.0 | 6057
0.10.0 | 5681
0.2.0 | 6732

## Last Results

- node: 6.9.5
- koa: 1.2.4
- toa: 2.5.1
- egg: 0.12.0

Scene | QPS | Avg RT (ms) | Stdev RT | Max RT
---   | --- | ---         | ---      | ---
egg Hello World | 8909 | 5.43 | 1.50 | 72.77
koa Hello World | 16931 | 3.42 | 2.03 | 80.48
toa Hello World | 17088 | 3.15 | 2.26 | 36.85
egg nunjucks | 6131 | 8.11 | 4.72 | 118.99
koa nunjucks | 9777 | 5.10 | 3.47 | 108.39
toa nunjucks | 10220 | 5.11 | 3.34 | 60.40

### Last Details

#### Hello World

```bash
------- koa hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.42ms    2.03ms  80.48ms   97.90%
    Req/Sec     1.81k   459.28    13.83k    97.00%
  144565 requests in 10.10s, 21.78MB read
Requests/sec:  14313.56
Transfer/sec:      2.16MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.15ms    2.26ms  36.85ms   92.42%
    Req/Sec     2.14k   534.18    16.13k    97.75%
  171007 requests in 10.10s, 28.87MB read
Requests/sec:  16931.91
Transfer/sec:      2.86MB

------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.43ms    1.50ms  72.77ms   99.05%
    Req/Sec     1.12k    58.52     1.18k    96.88%
  89200 requests in 10.01s, 29.94MB read
Requests/sec:   8909.79
Transfer/sec:      2.99MB
```

#### nunjucks

```bash
------- koa view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.10ms    3.47ms 108.39ms   94.83%
    Req/Sec     1.23k   140.26     1.45k    90.50%
  97870 requests in 10.01s, 244.63MB read
Requests/sec:   9777.23
Transfer/sec:     24.44MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.11ms    3.24ms  60.40ms   91.45%
    Req/Sec     1.29k   131.13     1.61k    75.50%
  102427 requests in 10.02s, 257.88MB read
Requests/sec:  10220.15
Transfer/sec:     25.73MB

------- egg view -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.11ms    4.72ms 118.99ms   92.25%
    Req/Sec   771.12     82.69     0.92k    82.60%
  61398 requests in 10.01s, 164.83MB read
Requests/sec:   6131.42
Transfer/sec:     16.46MB
2017-02-13 14:05:42,627 INFO 16275 [master] exit with code: 0
```
