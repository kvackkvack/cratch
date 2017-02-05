/*
  Replicates some of the functionality of sb2/cio.py
  Has multiple functions that generate data objects/arrays, mainly quite a lot of them for building specific blocks/scripts
 */

function Argument(value, type, name) {
  this.value = value, this.type = type, this.name = name
}
Argument.prototype.build = function() {
  return [part.type, part.value, part.name]
}
/* static */ Argument.buildParts = function(parts) {
  return parts.map(part => part instanceof Argument ? part.build() : part)
}

function Script(main, ...blocks) {
  this.data = Object.assign({
    type: 'define',
    depends: [],
    script: []
  }, main)
  blocks.forEach((block) =>
    this.data.script.push(block))
}
Script.prototype.push = function(block) {
  this.script.push(block)
  if(block[0] instanceof Array) {
    this.depends.push(block[0][1][0].trim())
  }
}
Script.prototype.build = function() {
  let obj = {}
  obj[this.data.name] = this.data
  return obj
}

const block = {
  Argument, Script,

  // custom blocks
  custom: {
    define(parts, ...blocks) {
      return new Script({
        type: 'define',
        name: parts[0],
        head: Argument.buildParts(parts),
      }, ...blocks)
    },
    call(parts, ...arguments) {
      arguments = arguments || []
      return [['stack', Argument.buildParts(parts)], ...arguments]
    },
    param(name) {
      return ['param', name, 'r']
    }
  },

  // green flag
  greenflag(...blocks) {
    return new Script({
      type: 'main',
      name: 'flag'
    }, ...blocks)
  },

  // control
  forever(body) {
    return ['doForever', body]
  },

  repeatn(count, body) {
    return ['doRepeat', count, body instanceof Array ? body : [body]]
  },
  repeatcond(condition, body) {
    return ['doUntil', condition, body instanceof Array ? body : [body]]
  },

  ifthen(condition, body) {
    return ['doIf', condition, body instanceof Array ? body : [body]]
  },
  ifelse(condition, body1, body2) {
    return ['doIfElse', condition, body1 instanceof Array ? body1 : [body1], body2 instanceof Array ? body2 : [body2]]
  },

  stop(what) {
    return ['stopScripts', what || 'this script']
  },

  // operators
  add(a, b) {
    return  ['+', a, b]
  },
  subtract(a, b) {
    return  ['-', a, b]
  },
  multiply(a, b) {
    return  ['*', a, b]
  },
  divide(a, b) {
    return  ['/', a, b]
  },
  mod(a, b) {
    return  ['%', a, b]
  },

  equal(a, b) {
    return ['=', a, b]
  },
  gt(a, b) {
    return  ['>', a, b]
  },
  lt(a, b) {
    return  ['<', a, b]
  },

  and(a, b) {
    return  ['&', a, b]
  },
  or(a, b) {
    return ['|', a, b]
  },
  not(cond) {
    return ['not', cond]
  },

  abs(n) {
    return ['abs', n]
  },
  round(n) {
    return ['rounded', n]
  },

  random(a, b) {
    return ['randomFrom:to:', a, b]
  },

  join(a, b) {
    return ['concatenate:with:', a, b]
  },
  letterof(n, str) {
    return ['letter:of:', n, str]
  },
  length(str) {
    return ['stringLength:', str]
  },

  special(op, n) {
    return ['computeFunction:of:', op, n]
  },

  // list
  list: {
    add(item, list) {
      return ['append:toList:', item, list]
    },
    remove(item, list) {
      return ['deleteLine:ofList:', item, list]
    },

    insert(item, index, list) {
      return ['insert:at:ofList:', item, index, list]
    },
    replace(index, list, item) {
      return ['setLine:ofList:to:', index, list, item]
    },

    get(name) {
      return ['contentsOfList:', name]
    },
    show(list) {
      return ['showList:', list]
    },
    hide(list) {
      return ['hideList:', list]
    },

    item(n, list) {
      return ['getLine:ofList:', n, list]
    },
    length(list) {
      return ['lineCountOfList:', list]
    },

    contains(list, value) {
      return ['list:contains:', list, value]
    }
  },

  // variable
  variable: {
    set(name, value) {
      return ['setVar:to:', name, value]
    },
    change(name, value) {
      return ['changeVar:by:', name, value]
    },

    get(name) {
      return ['readVariable', name]
    },
    show(name) {
      return ['showVariable:', name]
    },
    hide(name) {
      return ['hideVariable:', name]
    }
  }
}

module.exports = block
