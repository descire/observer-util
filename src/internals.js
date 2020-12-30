export const proxyToRaw = new WeakMap()
export const rawToProxy = new WeakMap()

/**
 * weakmap 的 key 值只能是 objectFit: 
 * 
 * weakmap 持有的是每个键对象的弱引用。在没有其他引用存在时垃圾回收能正确的进行。
 * 垃圾回收机制？
 * 
 */