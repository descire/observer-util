const proxyToRaw = new WeakMap();
const rawToProxy = new WeakMap();

function observable(obj) {
  // 4、优化：不重复代理
  if (proxyToRaw.has(obj)) {
    return obj;
  }
  return rawToProxy.get(obj) || createObservable(obj);
}

function createObservable(obj) {
  const observable = new Proxy(obj, {
    get: function(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key);

      // 1、如果结果为对象的话，需要递归再处理一下，为什么？？？
      if (typeof result === 'object' && result !== null) {
        // 2、描述器的属性会导致 get set 无法设置
        if (!descriptor || !(descriptor.writable === false && descriptor.configurable === false)) {
          return observable(result);
        }
      }

      return result;
    },
    set: function(target, key, value, receiver) {
      const hasKey = Reflect.has(target, key);
      const oldValue = target[key];

      const result = Reflect.set(target, key, value, receiver);
      // 3、重复执行的问题
      if (!hasKey) {
        console.log('新增属性');
      } else if (oldValue !== value) {
        console.log('属性值变化');
      }

      return result;
    }
  });
  return observable;
}

// 5、需求
function isObservable(obj) {
  return proxyToRaw.has(obj);
}

function raw(obj) {
  return proxyToRaw.get(obj) || obj;
}
