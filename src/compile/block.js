function Argument(value, type, name) {
  this.value = value, this.type = type, this.name = name
}
function Script(...blocks) {
  this.scripts =  {}
  blocks.forEach(function(block) {
    this.push(block)
  })
}
Script.prototype.push = function(script) {
  this.scripts[script.name] =
}

const block = {
  Argument,

  custom: {
    define(parts) {
      return {
        name: parts[0],
        type: 'define',
        head: parts.map(part => part instanceof Argument ? [part.type, part.value, part.name] : part),
        depends: [],

      }
    },
    call() {

    }
  },
}

module.exports = block
