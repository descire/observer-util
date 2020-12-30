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
      console.log(' -------------- ');
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
    }
  })
}


const o = observable(obj);

console.log(o.a.b.c.d);