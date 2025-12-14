# Aggregated CPU Profile Analysis

## Overview
- Profiles Analyzed: 4
- Total Ticks: 36076
- Total Unaccounted: 14600 (40.5%)

## Per-Worker Summary
| Worker | Ticks | JS% | Unaccounted% |
|--------|-------|-----|------------|
| isolate-0x82080c000-47318-v8-47318.log | 9016 | 54.1% | 45.7% |
| isolate-0xa6480c000-47317-v8-47317.log | 9021 | 53.2% | 46.8% |
| isolate-0xb6280c000-47319-v8-47319.log | 9031 | 53.7% | 46.3% |
| isolate-0xc7480c000-47316-v8-47316.log | 9008 | 54.8% | 23.0% |

## Top 25 Aggregated JavaScript Functions
| Total Ticks | Avg/Worker | % Total | Function |
|-------------|------------|---------|----------|
| 2497 | 624 | 6.92% | JS: *promiseInitHook node:internal/async_hooks:328:25 |
| 335 | 84 | 0.93% | JS: *promiseBeforeHook node:internal/async_hooks:346:27 |
| 279 | 70 | 0.77% | JS: *promiseAfterHook node:internal/async_hooks:353:26 |
| 156 | 39 | 0.43% | JS: *initWithInjectProperty file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/tegg-runtime/dist/impl/EggObjectImpl.js:20:33 |
| 139 | 35 | 0.39% | JS: *OrdinaryGetMetadata /Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/reflect-metadata/Reflect.js:591:37 |
| 121 | 30 | 0.34% | JS: *destroy file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/tegg-runtime/dist/model/AbstractEggContext.js:22:18 |
| 117 | 29 | 0.32% | JS: *objectPostCreate file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/lifecycle/dist/LifycycleUtil.js:38:27 |
| 114 | 29 | 0.32% | JS: *init file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/tegg-runtime/dist/model/AbstractEggContext.js:71:15 |
| 113 | 28 | 0.31% | RegExp: [^\t\x20-\x7e\x80-\xff] |
| 106 | 27 | 0.29% | JS: *getOrCreateEggObject file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/tegg-runtime/dist/factory/EggContainerFactory.js:28:38 |
| 98 | 25 | 0.27% | JS: *objectPreCreate file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/lifecycle/dist/LifycycleUtil.js:32:26 |
| 84 | 21 | 0.23% | RegExp: ^[\^_`a-zA-Z\-0-9!#$%&'*+.|~]+$ |
| 83 | 21 | 0.23% | JS: *handleRequest file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/koa/dist/application.js:150:31 |
| 82 | 21 | 0.23% | JS: *_storeHeader node:_http_outgoing:455:22 |
| 81 | 20 | 0.22% | JS: *emitInitScript node:internal/async_hooks:503:24 |
| 75 | 19 | 0.21% | JS: *session file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/session/node_modules/koa-session/dist/esm/index.js:184:34 |
| 73 | 18 | 0.20% | JS: *processTicksAndRejections node:internal/process/task_queues:72:35 |
| 72 | 18 | 0.20% | JS: *dispatch file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/core/node_modules/@eggjs/router/dist/Router.js:122:26 |
| 70 | 18 | 0.19% | JS: *dispatch /Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/koa/node_modules/koa-compose/index.js:35:23 |
| 63 | 16 | 0.17% | JS: *handleRequest file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/koa/dist/application.js:168:24 |
| 62 | 16 | 0.17% | JS: *parserOnIncoming node:_http_server:1073:26 |
| 57 | 14 | 0.16% | JS: *ctxLifecycleMiddleware file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/tegg-plugin/dist/lib/ctx_lifecycle_middleware.js:3:45 |
| 56 | 14 | 0.16% | JS: *destroy file:///Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/@eggjs/tegg-runtime/dist/impl/EggObjectImpl.js:147:18 |
| 55 | 14 | 0.15% | JS: *bodyParser /Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/egg4/node_modules/koa-bodyparser/index.js:63:35 |
| 52 | 13 | 0.14% | JS: *attachFinishedListener /Users/fengmk2/git/github.com/eggjs/benchmark/node_modules/on-finished/index.js:91:33 |

## Top 20 Aggregated V8 Builtins
| Total Ticks | Avg/Worker | % Total | Builtin |
|-------------|------------|---------|----------|
| 2075 | 519 | 5.75% | Builtin: KeyedLoadIC_Megamorphic |
| 831 | 208 | 2.30% | Builtin: KeyedStoreIC_Megamorphic |
| 753 | 188 | 2.09% | Builtin: GetProperty |
| 549 | 137 | 1.52% | Builtin: RunMicrotasks |
| 488 | 122 | 1.35% | Builtin: AsyncFunctionEnter |
| 413 | 103 | 1.14% | Builtin: FulfillPromise |
| 357 | 89 | 0.99% | Builtin: CallFunction_ReceiverIsNullOrUndefined |
| 309 | 77 | 0.86% | Builtin: FindOrderedHashMapEntry |
| 305 | 76 | 0.85% | Builtin: AsyncFunctionAwaitUncaught |
| 284 | 71 | 0.79% | Builtin: LoadIC |
| 256 | 64 | 0.71% | Builtin: Call_ReceiverIsNullOrUndefined |
| 242 | 61 | 0.67% | Builtin: ResolvePromise |
| 235 | 59 | 0.65% | Builtin: PromiseAll |
| 218 | 55 | 0.60% | Builtin: LoadIC_Megamorphic |
| 201 | 50 | 0.56% | Builtin: ResumeGeneratorTrampoline |
| 192 | 48 | 0.53% | Builtin: ObjectPrototypeHasOwnProperty |
| 170 | 43 | 0.47% | Builtin: RecordWriteSaveFP |
| 169 | 42 | 0.47% | Builtin: ArrayIteratorPrototypeNext |
| 146 | 37 | 0.40% | Builtin: PromisePrototypeThen |
| 137 | 34 | 0.38% | Builtin: NewPromiseCapability |

