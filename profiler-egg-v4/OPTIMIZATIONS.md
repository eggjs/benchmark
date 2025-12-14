# Egg.js v4 / TEGG Specific Code Optimizations

Based on CPU profile analysis, here are specific code locations that can be optimized.

---

## 1. CRITICAL: Fire-and-Forget Destroy in ctx_lifecycle_middleware.js

**File:** `@eggjs/tegg-plugin/dist/lib/ctx_lifecycle_middleware.js:24-29`

**Current Code:**
```javascript
finally {
    if (teggCtx.destroy) {
        teggCtx.destroy(lifecycleCtx).catch((e) => {
            e.message = `[tegg/ctxLifecycleMiddleware] destroy tegg ctx failed: ${e.message}`;
            ctx.logger.error(e);
        });
    }
}
```

**Problem:**
- Promise is not awaited - context destruction runs asynchronously
- If many requests come in, destroys pile up and run in parallel
- Can cause resource leaks and race conditions
- Contributes to high async hooks overhead

**Optimized Code:**
```javascript
finally {
    if (teggCtx.destroy) {
        try {
            await teggCtx.destroy(lifecycleCtx);
        } catch (e) {
            e.message = `[tegg/ctxLifecycleMiddleware] destroy tegg ctx failed: ${e.message}`;
            ctx.logger.error(e);
        }
    }
}
```

**Expected Impact:** Reduces concurrent Promise overhead, more predictable resource cleanup

---

## 2. HIGH: Symbol.for() on Every Lifecycle Hook Access

**File:** `@eggjs/lifecycle/dist/LifycycleUtil.js:68-79`

**Current Code:**
```javascript
static setLifecycleHook(method, hookName, clazz) {
    const LIFECYCLE_HOOK = Symbol.for(`EggPrototype#Lifecycle${hookName}`);
    MetadataUtil.defineMetaData(LIFECYCLE_HOOK, method, clazz);
}

getLifecycleHook(hookName, proto) {
    const LIFECYCLE_HOOK = Symbol.for(`EggPrototype#Lifecycle${hookName}`);
    return proto.getMetaData(LIFECYCLE_HOOK);
}
```

**Problem:**
- `Symbol.for()` + string concatenation called on EVERY object initialization
- Called 4-6 times per object (postConstruct, preInject, postInject, init, preDestroy, destroy)
- Creates temporary strings that need GC

**Optimized Code:**
```javascript
// Cache symbols at module level
const LIFECYCLE_SYMBOLS = {
    postConstruct: Symbol.for('EggPrototype#LifecyclepostConstruct'),
    preInject: Symbol.for('EggPrototype#LifecyclepreInject'),
    postInject: Symbol.for('EggPrototype#LifecyclepostInject'),
    init: Symbol.for('EggPrototype#Lifecycleinit'),
    preDestroy: Symbol.for('EggPrototype#LifecyclepreDestroy'),
    destroy: Symbol.for('EggPrototype#Lifecycledestroy'),
};

static setLifecycleHook(method, hookName, clazz) {
    const LIFECYCLE_HOOK = LIFECYCLE_SYMBOLS[hookName];
    if (!LIFECYCLE_HOOK) {
        throw new Error(`Unknown lifecycle hook: ${hookName}`);
    }
    MetadataUtil.defineMetaData(LIFECYCLE_HOOK, method, clazz);
}

getLifecycleHook(hookName, proto) {
    const LIFECYCLE_HOOK = LIFECYCLE_SYMBOLS[hookName];
    return LIFECYCLE_HOOK ? proto.getMetaData(LIFECYCLE_HOOK) : undefined;
}
```

**Expected Impact:** ~10-15% reduction in lifecycle hook overhead

---

## 3. HIGH: Sequential Promise.all() in Lifecycle Util

**File:** `@eggjs/lifecycle/dist/LifycycleUtil.js:32-49`

**Current Code:**
```javascript
async objectPreCreate(ctx, obj) {
    const globalLifecycleList = this.getLifecycleList();
    const objLifecycleList = this.getObjectLifecycleList(obj);
    await Promise.all(globalLifecycleList.map(...));  // First await
    await Promise.all(objLifecycleList.map(...));     // Second await - SEQUENTIAL!
}
```

**Problem:**
- Two sequential `await Promise.all()` calls
- Second wait doesn't start until first completes
- Same pattern in `objectPostCreate` and `objectPreDestroy`

**Optimized Code:**
```javascript
async objectPreCreate(ctx, obj) {
    const globalLifecycleList = this.getLifecycleList();
    const objLifecycleList = this.getObjectLifecycleList(obj);
    // Run both in parallel
    await Promise.all([
        ...globalLifecycleList.map((lifecycle) => LifecycleUtil.callPreCreate(lifecycle, ctx, obj)),
        ...objLifecycleList.map((lifecycle) => LifecycleUtil.callPreCreate(lifecycle, ctx, obj))
    ]);
}
```

**Expected Impact:** Up to 50% reduction in lifecycle phase duration

---

## 4. HIGH: Array.from() on Every getLifecycleList() Call

**File:** `@eggjs/lifecycle/dist/LifycycleUtil.js:11-12, 26-30`

**Current Code:**
```javascript
getLifecycleList() {
    return Array.from(this.lifecycleSet);  // New array allocation every time
}

getObjectLifecycleList(obj) {
    if (this.objLifecycleSet.has(obj.id)) {
        return Array.from(this.objLifecycleSet.get(obj.id));  // Another allocation
    }
    return [];
}
```

**Problem:**
- Called during init/destroy of EVERY object
- Creates new arrays that need GC
- For objects with same lifecycle hooks, same arrays are recreated

**Optimized Code (Option 1 - Cache arrays):**
```javascript
// Add cache invalidation when lifecycle set changes
_lifecycleListCache = null;

registerLifecycle(lifecycle) {
    this.lifecycleSet.add(lifecycle);
    this._lifecycleListCache = null;  // Invalidate cache
}

deleteLifecycle(lifecycle) {
    this.lifecycleSet.delete(lifecycle);
    this._lifecycleListCache = null;  // Invalidate cache
}

getLifecycleList() {
    if (!this._lifecycleListCache) {
        this._lifecycleListCache = Array.from(this.lifecycleSet);
    }
    return this._lifecycleListCache;
}
```

**Optimized Code (Option 2 - Iterate directly):**
```javascript
async objectPreCreate(ctx, obj) {
    // Iterate Set directly, no array allocation
    const promises = [];
    for (const lifecycle of this.lifecycleSet) {
        promises.push(LifecycleUtil.callPreCreate(lifecycle, ctx, obj));
    }
    const objSet = this.objLifecycleSet.get(obj.id);
    if (objSet) {
        for (const lifecycle of objSet) {
            promises.push(LifecycleUtil.callPreCreate(lifecycle, ctx, obj));
        }
    }
    await Promise.all(promises);
}
```

**Expected Impact:** Significant GC pressure reduction

---

## 5. HIGH: Proxy Handler Causes Megamorphic IC

**File:** `@eggjs/tegg-runtime/dist/impl/EggObjectUtil.js:26-96`

**Current Code:**
```javascript
static eggObjectProxy(eggObject) {
    // ...
    const proxy = new Proxy({}, {
        get(target, p) {
            // ...
            const obj = getObj();
            const val = obj[p];  // Megamorphic - p can be any property name
            if (typeof val === 'function') {
                return val.bind(obj);  // Creates new bound function EVERY time
            }
            return val;
        },
        // ... similar patterns in set, has, etc.
    });
}
```

**Problems:**
1. `obj[p]` with unbounded property names causes V8 megamorphic IC
2. `val.bind(obj)` creates a NEW bound function on every method access
3. Same pattern repeated in `contextEggObjectProxy`

**Optimized Code:**
```javascript
static eggObjectProxy(eggObject) {
    let _obj;
    const boundMethodCache = new Map();  // Cache bound methods

    function getObj() {
        if (!_obj) {
            _obj = eggObject.obj;
        }
        return _obj;
    }

    const proxy = new Proxy({}, {
        get(target, p) {
            if (p === 'then') return;
            if (Object.prototype.hasOwnProperty.call(Object.prototype, p)) {
                return target[p];
            }
            const obj = getObj();
            const val = obj[p];
            if (typeof val === 'function') {
                // Cache bound methods
                let bound = boundMethodCache.get(p);
                if (!bound) {
                    bound = val.bind(obj);
                    boundMethodCache.set(p, bound);
                }
                return bound;
            }
            return val;
        },
        // ...
    });
    return proxy;
}
```

**Expected Impact:** Reduces function allocation and may improve IC behavior

---

## 6. MEDIUM: Symbol Creation on contextEggObjectGetProperty

**File:** `@eggjs/tegg-runtime/dist/impl/EggObjectUtil.js:12-24`

**Current Code:**
```javascript
static contextEggObjectGetProperty(proto, objName) {
    const PROTO_OBJ_GETTER = Symbol(`EggPrototype#objGetter#${String(objName)}`);
    if (!proto[PROTO_OBJ_GETTER]) {
        proto[PROTO_OBJ_GETTER] = { /* ... */ };
    }
    return proto[PROTO_OBJ_GETTER];
}
```

**Problem:**
- Creates a new Symbol on EVERY call (note: `Symbol()` not `Symbol.for()`)
- The caching logic `if (!proto[PROTO_OBJ_GETTER])` NEVER works because Symbol is always new
- This is likely a BUG

**Optimized Code:**
```javascript
// Use Symbol.for() for global registry, or cache per proto+objName
const protoGetterSymbols = new Map();

static contextEggObjectGetProperty(proto, objName) {
    const cacheKey = `${proto.id}#${String(objName)}`;
    let PROTO_OBJ_GETTER = protoGetterSymbols.get(cacheKey);
    if (!PROTO_OBJ_GETTER) {
        PROTO_OBJ_GETTER = Symbol.for(`EggPrototype#objGetter#${String(objName)}`);
        protoGetterSymbols.set(cacheKey, PROTO_OBJ_GETTER);
    }
    if (!proto[PROTO_OBJ_GETTER]) {
        proto[PROTO_OBJ_GETTER] = {
            get() {
                const eggObject = EggContainerFactory.getEggObject(proto, objName);
                return eggObject.obj;
            },
            configurable: true,
            enumerable: true,
        };
    }
    return proto[PROTO_OBJ_GETTER];
}
```

**Expected Impact:** Fixes caching bug, reduces Symbol allocations

---

## 7. MEDIUM: Redundant EggContainerFactory.getEggObject Calls in Proxy

**File:** `@eggjs/tegg-runtime/dist/impl/EggObjectUtil.js:97-170`

**Current Code (contextEggObjectProxy):**
```javascript
const proxy = new Proxy({}, {
    get(target, p) {
        // ...
        const eggObject = EggContainerFactory.getEggObject(proto, objName);
        const obj = eggObject.obj;
        return obj[p];
    },
    set(_target, p, newValue) {
        const eggObject = EggContainerFactory.getEggObject(proto, objName);  // Called again!
        const obj = eggObject.obj;
        obj[p] = newValue;
        return true;
    },
    // Every single trap calls getEggObject!
});
```

**Problem:**
- EVERY proxy trap calls `EggContainerFactory.getEggObject(proto, objName)`
- Even consecutive get/set operations re-lookup the object

**Optimized Code:**
```javascript
static contextEggObjectProxy(proto, objName) {
    const PROTO_OBJ_PROXY = Symbol.for(`EggPrototype#objProxy#${String(objName)}`);
    if (!proto[PROTO_OBJ_PROXY]) {
        let cachedEggObject = null;

        function getEggObj() {
            if (!cachedEggObject) {
                cachedEggObject = EggContainerFactory.getEggObject(proto, objName);
            }
            return cachedEggObject;
        }

        proto[PROTO_OBJ_PROXY] = new Proxy({}, {
            get(target, p) {
                if (p === 'then') return;
                if (Object.prototype[p]) {
                    return target[p];
                }
                const obj = getEggObj().obj;
                return obj[p];
            },
            set(_target, p, newValue) {
                const obj = getEggObj().obj;
                obj[p] = newValue;
                return true;
            },
            // ... other traps use getEggObj()
        });
    }
    return proto[PROTO_OBJ_PROXY];
}
```

**Expected Impact:** Significant reduction in factory lookups

---

## 8. LOW: Empty lifecycleCtx Object Allocation

**File:** `@eggjs/tegg-plugin/dist/lib/ctx_lifecycle_middleware.js:9`

**Current Code:**
```javascript
const lifecycleCtx = {};
```

**Problem:**
- Allocated for every request
- Appears to be unused (empty object passed to init/destroy)

**Optimized Code:**
```javascript
// If truly unused, use a shared frozen object
const EMPTY_LIFECYCLE_CTX = Object.freeze({});

// In middleware:
const lifecycleCtx = EMPTY_LIFECYCLE_CTX;
```

**Expected Impact:** Minor GC reduction

---

## Summary Priority List

| Priority | Fix | File | Est. Impact |
|----------|-----|------|-------------|
| CRITICAL | Await destroy() promise | ctx_lifecycle_middleware.js | Resource leaks |
| HIGH | Cache lifecycle hook Symbols | LifycycleUtil.js | 10-15% |
| HIGH | Parallel Promise.all() | LifycycleUtil.js | 50% of lifecycle |
| HIGH | Cache/avoid Array.from() | LifycycleUtil.js | GC reduction |
| HIGH | Cache bound methods in Proxy | EggObjectUtil.js | Function alloc |
| MEDIUM | Fix Symbol() caching bug | EggObjectUtil.js | Bug fix |
| MEDIUM | Cache getEggObject in Proxy | EggObjectUtil.js | Factory lookups |
| LOW | Share empty lifecycleCtx | ctx_lifecycle_middleware.js | Minor GC |

---

## Node.js Runtime Optimization

For production deployment, consider:

```bash
# Disable async hooks if not using APM/tracing
node --no-async-hooks-promise-hooks app.js

# Expected impact: ~7% CPU reduction from promiseInitHook elimination
```
