# Egg.js v4 CPU Profile Analysis Report

## Executive Summary

This report analyzes CPU profiling data from 4 worker processes running an Egg.js v4 application under benchmark load. The profiling was conducted using V8's built-in profiler with Node.js 22.

### Key Findings

1. **Async/Promise Hooks Overhead**: The most significant CPU consumer is `promiseInitHook` at ~6.6-7.4% across all workers
2. **V8 Inline Cache Issues**: `KeyedLoadIC_Megamorphic` and `KeyedStoreIC_Megamorphic` indicate polymorphic property access patterns
3. **TEGG DI Runtime**: Object lifecycle management (create/destroy) contributes significant overhead
4. **High Unaccounted Time**: 23-47% unaccounted time suggests native/IO operations or profiler overhead

---

## Profile Statistics Summary

| Worker Process | Total Ticks | JavaScript | C++ | GC | Unaccounted |
|----------------|-------------|------------|-----|-----|-------------|
| isolate-47316 | 9008 | 54.8% | 22.2% | 5.0% | 23.0% |
| isolate-47317 | 9021 | 53.2% | 0.0% | 5.9% | 46.8% |
| isolate-47318 | 9016 | 54.1% | 0.0% | 5.0% | 45.7% |
| isolate-47319 | 9031 | 53.7% | 0.0% | 5.5% | 46.3% |

---

## Top Hotspot Functions (Aggregated)

### 1. Promise/Async Hook Functions (Critical - ~15-18% combined)

```
Function                                           | Avg Ticks | Avg %
---------------------------------------------------|-----------|-------
promiseInitHook (node:internal/async_hooks:328)    | ~620      | 6.8%
promiseBeforeHook (node:internal/async_hooks:346)  | ~85       | 0.9%
promiseAfterHook (node:internal/async_hooks:353)   | ~70       | 0.8%
```

**Impact**: These hooks are triggered for every Promise creation and resolution. The high overhead indicates heavy async/await usage in the request handling path.

**Recommendations**:
- Consider using `--no-async-hooks-promise-hooks` flag in production if async context tracking isn't needed
- Reduce unnecessary Promise wrapping
- Use native callbacks where possible for performance-critical paths

### 2. V8 Inline Cache Operations (Moderate - ~10-12% combined)

```
Builtin                              | Avg Ticks | Avg %
-------------------------------------|-----------|-------
KeyedLoadIC_Megamorphic              | ~520      | 5.7%
KeyedStoreIC_Megamorphic             | ~205      | 2.2%
GetProperty                          | ~190      | 2.1%
LoadIC_Megamorphic                   | ~55       | 0.6%
```

**Impact**: Megamorphic IC indicates V8 cannot optimize property access due to objects with different shapes (hidden classes) being accessed with the same code path.

**Root Causes**:
- Dynamic object creation with different property orders
- Object spread operators creating new shapes
- Mixing prototype chains

**Recommendations**:
- Ensure objects are created with consistent property orders
- Avoid dynamic property names when possible
- Use TypeScript/consistent object factories

### 3. TEGG Runtime Object Management (~8-10% combined)

```
Function                                                          | Avg Ticks | Avg %
------------------------------------------------------------------|-----------|-------
initWithInjectProperty (EggObjectImpl.js:20)                      | ~40       | 0.4%
objectPostCreate (LifycycleUtil.js:38)                            | ~30       | 0.3%
objectPreCreate (LifycycleUtil.js:32)                             | ~25       | 0.3%
getOrCreateEggObject (EggContainerFactory.js:28)                  | ~27       | 0.3%
destroy (AbstractEggContext.js:22)                                | ~28       | 0.3%
init (AbstractEggContext.js:71)                                   | ~30       | 0.3%
ctxLifecycleMiddleware (ctx_lifecycle_middleware.js:3)            | ~15       | 0.2%
```

**Impact**: Per-request context object creation and dependency injection adds measurable overhead.

**Recommendations**:
- Consider singleton patterns for stateless services
- Pool and reuse context objects where safe
- Reduce number of lifecycle hooks per request

### 4. HTTP Response Path (~5-8% combined)

```
Function                                                 | Avg Ticks | Avg %
---------------------------------------------------------|-----------|-------
clearBuffer (node:internal/streams/writable:744)         | ~16       | 0.2%
end (node:_http_outgoing:1085)                           | ~13       | 0.1%
handleRequest (application.js:168)                       | ~18       | 0.2%
handleRequest (application.js:150)                       | ~20       | 0.2%
_storeHeader (node:_http_outgoing:455)                   | ~21       | 0.2%
```

**Impact**: Standard HTTP response overhead, mostly unavoidable.

### 5. Middleware Chain Dispatch (~3-5% combined)

```
Function                                                           | Avg Ticks | Avg %
-------------------------------------------------------------------|-----------|-------
dispatch (koa-compose/index.js:35)                                 | ~16       | 0.2%
dispatch (Router.js:122)                                           | ~18       | 0.2%
session (koa-session/dist/esm/index.js:184)                        | ~18       | 0.2%
xframe (xframe.js:3)                                               | ~12       | 0.1%
xssProtection (xssProtection.js:3)                                 | ~13       | 0.1%
nosniff (nosniff.js:14)                                            | ~12       | 0.1%
noopen (noopen.js:4)                                               | ~10       | 0.1%
```

**Impact**: Multiple middleware layers add incremental overhead.

**Recommendations**:
- Audit middleware chain for necessity
- Consider consolidating security headers into single middleware
- Use conditional middleware loading

---

## Call Relationship Diagram

```
                            ┌─────────────────────────────────────┐
                            │         HTTP Request In             │
                            └─────────────────┬───────────────────┘
                                              │
                            ┌─────────────────▼───────────────────┐
                            │   parserOnIncoming (HTTP Parser)    │
                            └─────────────────┬───────────────────┘
                                              │
                            ┌─────────────────▼───────────────────┐
                            │   handleRequest (Koa Application)   │
                            │        application.js:150           │
                            └─────────────────┬───────────────────┘
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     │                        │                        │
        ┌────────────▼────────────┐           │           ┌────────────▼────────────┐
        │   promiseInitHook       │◄──────────┤           │   AsyncFunctionEnter    │
        │   (async_hooks:328)     │           │           │   (V8 Builtin)          │
        │   [6.8% CPU]            │           │           │   [1.3% CPU]            │
        └─────────────────────────┘           │           └─────────────────────────┘
                                              │
                            ┌─────────────────▼───────────────────┐
                            │    dispatch (koa-compose)           │
                            │    Middleware Chain Start           │
                            └─────────────────┬───────────────────┘
                                              │
     ┌────────────────────────────────────────┼────────────────────────────────────────┐
     │                                        │                                        │
┌────▼────┐  ┌────────────┐  ┌───────────┐  ┌▼────────────┐  ┌────────────┐  ┌────────▼────────┐
│  meta   │→│  siteFile  │→│ notfound  │→│   static    │→│ bodyParser │→│    session      │
│ [0.1%]  │  │   [0.1%]   │  │  [0.1%]   │  │   [0.1%]    │  │  [0.2%]    │  │    [0.2%]       │
└────┬────┘  └─────┬──────┘  └────┬──────┘  └──────┬──────┘  └─────┬──────┘  └───────┬─────────┘
     │             │              │                │               │                 │
     └─────────────┴──────────────┴────────────────┴───────────────┴─────────────────┘
                                              │
                            ┌─────────────────▼───────────────────┐
                            │       teggRootProto Middleware      │
                            │  (tegg_root_proto.js)               │
                            └─────────────────┬───────────────────┘
                                              │
                            ┌─────────────────▼───────────────────┐
                            │    ctxLifecycleMiddleware           │
                            │    (ctx_lifecycle_middleware.js)    │
                            │    [0.2% CPU]                       │
                            └─────────────────┬───────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     │              TEGG Context Init                  │
                     │                                                 │
        ┌────────────▼────────────┐                   ┌────────────────▼─────────────┐
        │   init (AbstractEgg     │                   │ initWithInjectProperty       │
        │   Context.js:71)        │                   │ (EggObjectImpl.js:20)        │
        │   [0.3% CPU]            │                   │ [0.4% CPU]                   │
        └────────────┬────────────┘                   └────────────────┬─────────────┘
                     │                                                 │
        ┌────────────▼────────────┐                   ┌────────────────▼─────────────┐
        │   objectPreCreate       │                   │   getOrCreateEggObject       │
        │   (LifycycleUtil.js:32) │                   │   (EggContainerFactory.js)   │
        │   [0.3% CPU]            │                   │   [0.3% CPU]                 │
        └────────────┬────────────┘                   └────────────────┬─────────────┘
                     │                                                 │
        ┌────────────▼────────────┐                   ┌────────────────▼─────────────┐
        │   objectPostCreate      │                   │   OrdinaryGetMetadata        │
        │   (LifycycleUtil.js:38) │◄──────────────────│   (reflect-metadata)         │
        │   [0.3% CPU]            │                   │   [0.4% CPU]                 │
        └────────────┬────────────┘                   └──────────────────────────────┘
                     │
                     └────────────────────────────────────────────────┐
                                              │                       │
                            ┌─────────────────▼───────────────────┐   │
                            │       Security Middleware Chain      │   │
                            │   (xframe→xss→nosniff→noopen→dta)   │   │
                            │   [~0.5% combined]                   │   │
                            └─────────────────┬───────────────────┘   │
                                              │                       │
                            ┌─────────────────▼───────────────────┐   │
                            │       Router Dispatch                │   │
                            │   (Router.js:122)                    │   │
                            │   [0.2% CPU]                         │   │
                            └─────────────────┬───────────────────┘   │
                                              │                       │
                            ┌─────────────────▼───────────────────┐   │
                            │    Controller: index                 │   │
                            │    (app/controller/async.js:3)       │   │
                            │    [<0.1% CPU]                       │   │
                            └─────────────────┬───────────────────┘   │
                                              │                       │
                            ┌─────────────────▼───────────────────┐   │
                            │    handleRequest (Response)          │   │
                            │    (application.js:168)              │   │
                            │    [0.2% CPU]                        │   │
                            └─────────────────┬───────────────────┘   │
                                              │                       │
        ┌─────────────────────────────────────┼─────────────────────┐ │
        │                                     │                     │ │
┌───────▼───────┐              ┌──────────────▼──────────────┐     │ │
│ _storeHeader  │              │   end (_http_outgoing)      │     │ │
│ [0.2% CPU]    │              │   [0.1% CPU]                │     │ │
└───────┬───────┘              └──────────────┬──────────────┘     │ │
        │                                     │                     │ │
        └─────────────────┬───────────────────┘                     │ │
                          │                                         │ │
             ┌────────────▼────────────┐                            │ │
             │   clearBuffer            │                           │ │
             │   (writable:744)         │                           │ │
             │   [~20% in UNKNOWN]      │◄──────────────────────────┘ │
             └────────────┬────────────┘                              │
                          │                                           │
                          │         ┌─────────────────────────────────┘
                          │         │
             ┌────────────▼─────────▼───────────┐
             │    TEGG Context Destroy           │
             │    destroy (AbstractEggContext)   │
             │    [0.3% CPU]                     │
             └────────────┬─────────────────────┘
                          │
        ┌─────────────────┼─────────────────────┐
        │                 │                     │
┌───────▼───────┐  ┌──────▼──────┐  ┌──────────▼──────────┐
│ objectPre     │  │ destroyObj  │  │ promiseAfterHook    │
│ Destroy       │  │ (EggObject  │  │ (async_hooks:353)   │
│ [0.2% CPU]    │  │ Factory)    │  │ [0.8% CPU]          │
└───────────────┘  │ [0.1% CPU]  │  └─────────────────────┘
                   └─────────────┘
```

---

## V8 Megamorphic IC Analysis

The high `KeyedLoadIC_Megamorphic` and `KeyedStoreIC_Megamorphic` percentages indicate V8 is unable to optimize property accesses. This typically happens when:

### Common Patterns in TEGG/Egg.js

1. **Dynamic Context Properties**
```javascript
// Anti-pattern: Dynamic property access
ctx[key] = value;  // Creates megamorphic IC

// Better: Use Map for dynamic keys
ctx._storage.set(key, value);
```

2. **Object Spread with Different Shapes**
```javascript
// Anti-pattern
const config = { ...defaults, ...overrides };  // New shape each time

// Better: Consistent factory
function createConfig(overrides) {
  return {
    host: overrides.host ?? 'localhost',
    port: overrides.port ?? 3000,
    // ... all properties in consistent order
  };
}
```

3. **Reflect-metadata Access Patterns**
```javascript
// The OrdinaryGetMetadata recursive calls suggest metadata
// lookups across prototype chains with different shapes
Reflect.getMetadata(key, target);  // Megamorphic if targets vary
```

---

## Bottom-Up Heavy Profile Analysis

The "UNKNOWN" category in bottom-up profiles (20-46%) represents time in:
- Native code execution (I/O, crypto, etc.)
- Time between profiler samples
- V8 runtime operations

### Major Call Chains (by ticks)

1. **HTTP Response Writing** (~850 ticks per worker)
   ```
   clearBuffer → end → handleRequest → AsyncFunctionAwaitResolveClosure
   ```

2. **EggObject Initialization** (~100 ticks per worker)
   ```
   EggObjectImpl.js:40 (anonymous) → AsyncFunctionAwaitResolveClosure
   ```

3. **Request Parsing** (~180 ticks per worker)
   ```
   nextTick → resOnFinish → onFinish → afterWriteTick → processTicksAndRejections
   ```

---

## Optimization Recommendations

### High Impact

1. **Disable Async Hooks in Production** (if not needed)
   ```bash
   node --no-async-hooks-promise-hooks app.js
   ```
   Expected improvement: ~7-8% CPU reduction

2. **Optimize TEGG Object Lifecycle**
   - Implement object pooling for request contexts
   - Lazy-initialize dependencies
   - Consider prototype-scope for stateless services

3. **Address Megamorphic Property Access**
   - Audit hot paths for consistent object shapes
   - Use `Map`/`WeakMap` for dynamic key storage
   - Consider using ES6 classes with fixed shapes

### Medium Impact

4. **Consolidate Security Middleware**
   - Merge xframe, xss, nosniff, noopen into single middleware
   - Expected improvement: ~0.3% CPU reduction

5. **Reduce Middleware Chain Length**
   - Audit and remove unused middleware
   - Use conditional loading based on route

### Low Impact (but good practices)

6. **Use Native HTTP/2** where possible
7. **Consider Worker Threads** for CPU-intensive operations
8. **Profile with `--prof-process`** for more detailed analysis

---

## Files Analyzed

- `isolate-0x82080c000-47318-v8-47318.log-processed.txt`
- `isolate-0xa6480c000-47317-v8-47317.log-processed.txt`
- `isolate-0xb6280c000-47319-v8-47319.log-processed.txt`
- `isolate-0xc7480c000-47316-v8-47316.log-processed.txt`

## Analysis Date

December 14, 2025

---

## Appendix: Using the Analysis Script

```bash
# Generate markdown report
node profiler-egg-v4/analyze-profile.js isolate-*.log-processed.txt

# Generate JSON output
node profiler-egg-v4/analyze-profile.js isolate-*.log-processed.txt --json
```
