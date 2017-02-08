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
0.11.0 | 8889 👍
0.10.0 | 8470
0.2.0 | 8917

### nunjucks

egg version | QPS
--- | ---
0.11.0 | 6057 👍
0.10.0 | 5681
0.2.0 | 6732

## Last Results

- node: 6.9.5
- koa: 1.2.4
- toa: 2.5.1
- egg: 0.11.0

Scene | QPS | Avg RT (ms) | Stdev RT | Max RT
---   | --- | ---         | ---      | ---
egg Hello World | 8889 | 5.44 | 1.37 | 72.51
koa Hello World | 14396 | 3.40 | 2.02 | 80.25
toa Hello World | 17088 | 3.11 | 2.20 | 34.68
egg nunjucks | 6057 | 8.21 | 4.98 | 144.38
koa nunjucks | 9708 | 5.12 | 3.43 | 106.71
toa nunjucks | 10319 | 5.08 | 3.30 | 67.68

### Last Details

#### Hello World

```bash
------- koa hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.40ms    2.02ms  80.25ms   97.94%
    Req/Sec     1.82k   454.30    13.76k    97.13%
  145395 requests in 10.10s, 21.91MB read
Requests/sec:  14396.40
Transfer/sec:      2.17MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.11ms    2.20ms  34.68ms   92.52%
    Req/Sec     2.16k   503.30    15.39k    97.25%
  172567 requests in 10.10s, 29.13MB read
Requests/sec:  17088.64
Transfer/sec:      2.88MB

------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.44ms    1.37ms  72.51ms   97.76%
    Req/Sec     1.12k    60.41     1.36k    95.38%
  89033 requests in 10.02s, 29.89MB read
Requests/sec:   8889.50
Transfer/sec:      2.98MB
```

#### nunjucks

```bash
------- koa view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.12ms    3.43ms 106.71ms   94.68%
    Req/Sec     1.22k   147.22     1.63k    84.75%
  97285 requests in 10.02s, 243.17MB read
Requests/sec:   9708.90
Transfer/sec:     24.27MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.08ms    3.30ms  67.68ms   91.45%
    Req/Sec     1.30k   136.18     1.62k    73.00%
  103316 requests in 10.01s, 260.12MB read
Requests/sec:  10319.24
Transfer/sec:     25.98MB

------- egg view -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.21ms    4.98ms 144.38ms   91.78%
    Req/Sec   761.35     88.32     0.91k    72.12%
  60666 requests in 10.02s, 162.86MB read
Requests/sec:   6057.31
Transfer/sec:     16.26MB
```
