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
0.12.0 | 7.6.0 | 10899 | 11122
0.12.0 | 6.9.5 | 8880 | -
0.11.0 | 6.9.5 | 8889 | -
0.10.0 | 6.9.5 | 8470 | -
0.2.0 | 6.9.5 | 8917 | -

### nunjucks

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
0.12.0 | 7.6.0 | 7216 | 7371
0.12.0 | 6.9.5 | 5967 | -
0.11.0 | 6.9.5 | 6057 | -
0.10.0 | 6.9.5 | 5681 | -
0.2.0 | 6.9.5 | 6732 | -

### passport

- egg-passport: 1.0.0

egg version | node version | QPS Generator | Async Await
--- | --- | --- | ---
0.12.0 | 7.6.0 | 9981 | 10436
0.12.0 | 6.9.5 | 7943 | -

## Last Results

- node: 7.6.0
- koa: 1.2.5
- toa: 2.6.0
- egg: 0.12.0

Scene | QPS | Avg RT (ms) | Stdev RT | Max RT
---   | --- | ---         | ---      | ---
koa Hello World | 17923 | 2.73 | 1.19 | 54.76
toa Hello World | 18353 | 2.94 | 2.26 | 39.05
egg Hello World | 10899 | 4.45 | 1.55 | 69.40
egg Hello World (Async Await) | 11122 | 4.34 | 1.12 | 57.48
egg Hello Passport | 9981 | 4.91 | 2.26 | 83.50
egg Hello Passport (Async Await) | 10436 | 4.60 | 0.64 | 38.03
koa nunjucks | 12414 | 4.09 | 2.76 | 82.85
toa nunjucks | 11815 | 4.56 | 3.37 | 67.71
egg nunjucks | 7216 | 7.02 | 4.51 | 119.89
egg nunjucks (Async Await) | 7371 | 6.74 | 3.14 | 70.87

### Last Details

#### Hello World

```bash
------- koa hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.73ms    1.19ms  54.76ms   98.13%
    Req/Sec     2.25k   192.02     2.52k    96.50%
  179343 requests in 10.01s, 27.02MB read
Requests/sec:  17923.27
Transfer/sec:      2.70MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.94ms    2.26ms  39.05ms   92.36%
    Req/Sec     2.32k   538.84    16.61k    97.25%
  185369 requests in 10.10s, 31.29MB read
Requests/sec:  18353.21
Transfer/sec:      3.10MB

------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.45ms    1.55ms  69.40ms   96.77%
    Req/Sec     1.37k   131.73     1.65k    75.00%
  109099 requests in 10.01s, 36.62MB read
Requests/sec:  10899.14
Transfer/sec:      3.66MB

------- egg hello (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.34ms    1.12ms  57.48ms   95.55%
    Req/Sec     1.40k    61.39     1.95k    81.75%
  111324 requests in 10.01s, 37.37MB read
Requests/sec:  11122.52
Transfer/sec:      3.73MB
```

#### nunjucks

```bash
------- koa view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.09ms    2.76ms  82.85ms   92.69%
    Req/Sec     1.56k   241.61     2.00k    70.00%
  124262 requests in 10.01s, 310.60MB read
Requests/sec:  12414.23
Transfer/sec:     31.03MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.56ms    3.37ms  67.71ms   90.58%
    Req/Sec     1.49k   143.71     1.79k    72.38%
  118312 requests in 10.01s, 297.87MB read
Requests/sec:  11815.36
Transfer/sec:     29.75MB

------- egg view -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     7.02ms    4.51ms 119.89ms   90.40%
    Req/Sec     0.91k   252.19     1.52k    76.00%
  72351 requests in 10.03s, 194.23MB read
Requests/sec:   7216.49
Transfer/sec:     19.37MB

------- egg view (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     6.74ms    3.14ms  70.87ms   90.21%
    Req/Sec     0.93k    61.06     1.41k    78.75%
  73881 requests in 10.02s, 198.76MB read
Requests/sec:   7371.91
Transfer/sec:     19.83MB
```

#### Hello Passport

```bash
------- egg passport -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.91ms    2.26ms  83.50ms   98.23%
    Req/Sec     1.25k   126.68     1.38k    92.88%
  99884 requests in 10.01s, 33.34MB read
Requests/sec:   9981.20
Transfer/sec:      3.33MB

------- egg passport (Async Await) -------

Running 10s test @ http://127.0.0.1:7001/aa
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.60ms  644.10us  38.03ms   95.03%
    Req/Sec     1.31k    36.83     1.69k    95.25%
  104519 requests in 10.01s, 35.29MB read
Requests/sec:  10436.83
Transfer/sec:      3.52MB
```
