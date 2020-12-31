
const IS_REACTION = Symbol('is reaction');

// 按需触发
function observer(fn) {
  const reaction = fn[IS_REACTION] ? fn : function reaction() { return runAsReaction(reaction, fn, this, arguments)}

  reaction(); // 采集依赖
  
  return reaction;
}

function unobserver() {}