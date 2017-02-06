const block = require('./block')
      commands = require('./commands')

function compile(string) {
  let blocks = [ ]

  const lines = string.split(/[\n\r]+/g)
  lines.forEach((line) => {
    if(line == '') return
    const parts = line.split(/\s+/g)
    blocks.push(commands[parts[0]](parts[1]))
  })

  let scripts = {}

  Object.assign(scripts, block.greenflag(
    block.variable.set('EXE PTR', 0),
    block.list.remove('data', block.list.ALL),
    block.list.remove('return stack', block.list.ALL),
    block.forever([
      block.custom.call(['tick']),
      block.variable.change('EXE PTR', 1)
    ])
  ).build())

  Object.assign(scripts, block.custom.define(
    ['tick']
    // TODO: insert binary tree resembling the `blocks` var here
  ).build())

  return scripts
}

module.exports = compile
