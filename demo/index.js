const obj = {
  student: {
    name: 'xiaoming'
  },
  a: {
    b: {
      c: {
        d: 1
      }
    }
  }
};

function observable(obj) {
  return new Proxy(obj, {
    get: function(target, key, receiver) {
      console.log(' ---- 拦截 get 方法 ---- ');
      console.log(`拦截到的 ${key} `);
      const result = Reflect.get(target, key, receiver);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
      /**
       * 1、嵌套对象的递归处理，否则只能拦截到首个属性。
       * 2、执行 Proxy 必须是对象
       * 3、递归的过程中需要判断属性描述器相关的限制
       */
      if (typeof result === 'object' && result !== null) {
        if (
          !descriptor ||
          !(descriptor.writable === false && descriptor.configurable === false)
        ) {
          return observable(result);
        }
      }
      return result;
    },
    set: function(target, key, value, receiver) {
      console.log(' ---- 拦截 set 方法 ---- ');
      /**
       * 1、数组重复的问题
       * 2、避免重复监听的问题
       */
      // key 是否为新增的。
      const hadKey = hasOwnProperty.call(target, key);

      // 旧值
      const oldValue = target[key];
      // 避免重复拦截的问题
      // if (typeof value === 'object' && value !== null) {
      //   value = proxyToRaw.get(value) || value
      // }
      const result = Reflect.set(target, key, value, receiver)
      if (!hadKey) {
        console.log(' 新增 key ');
      } else if (oldValue !== value) {
        console.log(' 原始值的变更 ');
      }
      return result

    }
  })
}


const o = observable(obj);

const arr = observable([1, 2, 3, 4]);

arr.push(5);