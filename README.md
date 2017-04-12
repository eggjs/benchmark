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

- koa1: `wrk http://127.0.0.1:7002/ -d 10 -c 50 -t 8`
- koa2: `wrk http://127.0.0.1:7004/ -d 10 -c 50 -t 8`
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
- toa: 2.6.4
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

```
------- koa1 hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.66ms    1.21ms  54.12ms   97.00%
    Req/Sec     2.31k   567.18    17.35k    97.88%
  183985 requests in 10.10s, 27.90MB read
Requests/sec:  18216.95
Transfer/sec:      2.76MB

------- koa2 hello -------

Running 10s test @ http://127.0.0.1:7004/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.21ms    0.88ms  46.81ms   98.36%
    Req/Sec     2.76k   306.42     7.71k    97.76%
  220540 requests in 10.10s, 33.44MB read
Requests/sec:  21836.19
Transfer/sec:      3.31MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.02ms    2.25ms  37.23ms   93.25%
    Req/Sec     2.25k   191.30     2.57k    76.62%
  179288 requests in 10.01s, 30.26MB read
Requests/sec:  17915.99
Transfer/sec:      3.02MB

------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.41ms    1.54ms  63.65ms   96.77%
    Req/Sec     1.38k    91.35     1.50k    86.75%
  110119 requests in 10.01s, 36.97MB read
Requests/sec:  11004.66
Transfer/sec:      3.69MB

------- egg hello (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.29ms  657.51us  38.94ms   95.74%
    Req/Sec     1.41k    38.53     1.68k    86.00%
  112079 requests in 10.01s, 37.62MB read
Requests/sec:  11200.43
Transfer/sec:      3.76MB

------- koa1 view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.23ms    2.34ms  78.19ms   92.62%
    Req/Sec     1.48k   162.98     1.75k    80.88%
  118249 requests in 10.01s, 295.80MB read
Requests/sec:  11807.91
Transfer/sec:     29.54MB

------- koa2 view -------

Running 10s test @ http://127.0.0.1:7004/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.70ms    2.07ms  58.03ms   92.51%
    Req/Sec     1.71k   159.94     2.03k    78.50%
  135920 requests in 10.01s, 340.00MB read
Requests/sec:  13583.18
Transfer/sec:     33.98MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.72ms    3.46ms  76.32ms   90.81%
    Req/Sec     1.42k   162.33     1.80k    75.88%
  113423 requests in 10.02s, 285.57MB read
Requests/sec:  11320.40
Transfer/sec:     28.50MB

------- egg nunjucks view -------

Running 10s test @ http://127.0.0.1:7001/nunjucks
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.06ms    3.71ms 101.34ms   91.20%
    Req/Sec   765.96     73.22     0.87k    83.25%
  61051 requests in 10.02s, 164.95MB read
Requests/sec:   6092.76
Transfer/sec:     16.46MB

------- egg ejs view -------

Running 10s test @ http://127.0.0.1:7001/ejs
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.00ms    2.33ms  61.49ms   92.65%
    Req/Sec     0.87k    44.15     1.07k    85.88%
  69279 requests in 10.02s, 187.97MB read
Requests/sec:   6916.65
Transfer/sec:     18.77MB

------- egg nunjucks view (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/nunjucks-aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.97ms    3.03ms  60.90ms   90.93%
    Req/Sec   769.38     52.88     1.09k    84.25%
  61315 requests in 10.02s, 166.36MB read
Requests/sec:   6121.37
Transfer/sec:     16.61MB

------- egg ejs view (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/ejs-aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.94ms    2.30ms  55.01ms   92.35%
    Req/Sec     0.88k    47.82     1.14k    81.62%
  69952 requests in 10.01s, 190.19MB read
Requests/sec:   6985.50
Transfer/sec:     18.99MB

------- egg passport -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.88ms    2.69ms  95.22ms   98.55%
    Req/Sec     1.27k   127.60     1.64k    93.75%
  101312 requests in 10.01s, 33.82MB read
Requests/sec:  10117.09
Transfer/sec:      3.38MB

------- egg passport (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.60ms    1.68ms  80.12ms   99.18%
    Req/Sec     1.33k    64.42     1.86k    92.25%
  105669 requests in 10.01s, 35.67MB read
Requests/sec:  10556.30
Transfer/sec:      3.56MB
```
