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

## egg versions benchmark

### Hello World

egg version | QPS
--- | ---
0.10.0 | 8470

### nunjucks

egg version | QPS
--- | ---
0.10.0 | 5681

## Last Results

- node: 6.9.5
- koa: 1.2.4
- toa: 2.5.1
- egg: 0.10.0

Scene | QPS | Avg RT (ms) | Stdev RT | Max RT
---   | --- | ---         | ---      | ---
egg Hello World | 8470 | 5.86 | 3.60 | 121.69
koa Hello World | 14159 | 3.37 | 0.52 | 32.17
toa Hello World | 16676 | 3.21 | 2.25 | 37.70
egg nunjucks | 5681 | 8.84 | 6.24 | 175.02
koa nunjucks | 9056 | 5.39 | 2.20 | 73.22
toa nunjucks | 9830 | 5.26 | 3.48 | 80.05

### Last Details

#### Hello World

```bash
------- egg hello -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.86ms    3.60ms 121.69ms   98.75%
    Req/Sec     1.07k   108.88     1.30k    94.62%
  84834 requests in 10.02s, 28.48MB read
Requests/sec:   8470.22
Transfer/sec:      2.84MB

------- koa hello -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.37ms  525.80us  32.17ms   94.67%
    Req/Sec     1.79k   406.50    13.19k    99.38%
  142991 requests in 10.10s, 21.55MB read
Requests/sec:  14159.54
Transfer/sec:      2.13MB

------- toa hello -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.21ms    2.25ms  37.70ms   93.39%
    Req/Sec     2.10k   166.11     2.40k    75.00%
  166900 requests in 10.01s, 28.17MB read
Requests/sec:  16676.17
Transfer/sec:      2.81MB
```

#### nunjucks

```bash
------- egg view -------

Running 10s test @ http://127.0.0.1:7001/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     8.84ms    6.24ms 175.02ms   93.41%
    Req/Sec   715.54     86.60     0.87k    81.58%
  56910 requests in 10.02s, 152.78MB read
Requests/sec:   5681.20
Transfer/sec:     15.25MB

------- koa view -------

Running 10s test @ http://127.0.0.1:7002/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.39ms    2.20ms  73.22ms   92.56%
    Req/Sec     1.14k    97.00     1.29k    74.75%
  90668 requests in 10.01s, 226.63MB read
Requests/sec:   9056.44
Transfer/sec:     22.64MB

------- toa view -------

Running 10s test @ http://127.0.0.1:7003/
  8 threads and 50 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     5.26ms    3.48ms  80.05ms   92.65%
    Req/Sec     1.24k   173.33     1.70k    70.25%
  98441 requests in 10.01s, 247.84MB read
Requests/sec:   9830.29
Transfer/sec:     24.75MB
```
