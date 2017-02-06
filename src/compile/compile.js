const block = require('./block')
      commands = require('./commands')

function compile(string) {
  let blocks = [ ]

  const lines = string.split(/[\n\r]+/g)
  lines.forEach((line) => {
    if(line == '') return
    const parts = splitIntoItems(line, {
      '(["\'`])(.*?[^\\\\])\\1': a => a[2],
      '\\S+': a => a[0]
    })
    console.log(parts)
    blocks.push(commands[parts[0]](parts.slice(1)))
  })

  let scripts = {}

  Object.assign(scripts, block.greenflag(
    block.variable.set('EXE PTR', 0),
    block.list.remove('data', block.list.ALL),
    block.list.remove('returns', block.list.ALL),
    block.list.remove('log', block.list.ALL),
    block.forever([
      block.custom.call(['tick']),
      block.variable.change('EXE PTR', 1),
      block.ifthen(
        block.gt( block.variable.get('EXE PTR'), blocks.length - 1 ),
        [ block.stop('all') ]
      )
    ])
  ).build())

  Object.assign(scripts, block.custom.define(
    { parts: ['tick'], pos: { x: 200, y: 0 }},
    binaryTreeOfIf( block.variable.get('EXE PTR'), [0, blocks.length - 1], blocks )
  ).build())

  return { scripts: scripts, vars: [ 'EXE PTR' ], lists: [ 'returns', 'log', 'data' ] }
}

function splitIntoItems(str, itemobj, split) {
  let i = 0, items = []
  split = split || /^\s+/g
  while(i < str.length) {
    let match
    for(let item in itemobj) {
      match = new RegExp('^' + item, 'g').exec(str.substring(i))
      if(match) {
        items.push(itemobj[item](match))
        break
      }
    }
    if(!match) return items
    i += match[0].length
    let space = str.substring(i).match(split) || ['']
    i += space[0].length
  }
  return items
}

function binaryTreeOfIf(compare, range, parts) {
  if(range[0] == range[1]) {
    return parts[range[0]]
  } else {
    let mid = Math.floor(range[0] + (range[1] + range[0]) / 2)
    return block.ifelse(
      block.gt(compare, mid),
      binaryTreeOfIf(compare, [ mid + 1, range[1] ], parts),
      binaryTreeOfIf(compare, [ range[0], mid ], parts)
    )
  }
}

module.exports = compile
