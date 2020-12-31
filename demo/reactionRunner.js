const reactionStack = [];

export function runAsReaction (reaction, fn, context, args) {
  if (reactionStack.indexOf(reaction) === -1) {

    try {
      reactionStack.push(reaction)
      return Reflect.apply(fn, context, args)
    } finally {
      // always remove the currently running flag from the reaction when it stops execution
      reactionStack.pop()
    }
  }
}
