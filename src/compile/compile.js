const block = require('./block')

const commands = {}

function compile(string) {
  let blocks = [ ]

  const lines = string.split(/;\s*/g)
  lines.forEach((line) => {
    if(line == '') return
    const parts = line.split(/\sy+/g)
    blocks.push(commands[parts[0]](parts[1]))
  })

  let scripts = {}

  Object.assign(scripts, block.greenflag(
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
