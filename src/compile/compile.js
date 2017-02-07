const block = require('./block')
      commands = require('./commands')

function compile(string) {
  let blocks = [ ], labels = { },
      depends = [ ],
      instruction = 0

  const lines = string.split(/[\n\r]+/g)
  lines.forEach((line, i) => {
    try {
      if(line == '' || line[0] == '#') return

      function Label(x) { this.x = x } // bad OOP

      let matchnum = '([\\+\\-]?\\d+(\\.\\d*)?)'
      function parsenum(num, radix = 10) {
        if(radix != 10) {
          if(num.indexOf('.') > -1) throw 'Numbers not in base 10 may not be floating point.'
          return Number.parseInt(num, radix)
        } else {
          return Number.parseFloat(num)
        }
      }

      const parts = splitIntoItems(line.trimLeft(), {
        '([^\s:]+):': a => new Label(a[1]), // labels

        '(["\'`])(.*?[^\\\\])\\1': a => a[2], // strings
        [matchnum]: a => parsenum(a[1], 10), // decimal nums
        ['0x'+matchnum]: a => parsenum(a[1], 16), // hex nums
        ['0b'+matchnum]: a => parsenum(a[1], 2), // binary nums
        [matchnum+':(\\d+)']: a => parsenum(a[1], a[3]), // nums in any base (e.g 120:3 is 120 in base 3)
        '[^\\s:]+': a => a[0] // plain values
      })

      let labelparts = parts.filter(part => part instanceof Label)
      if(labelparts.length > 0) {
        if(parts.length > 1) throw `Non-label statement cannot include label (label: ${labelparts[0]})`
        labels[labelparts[0].x] = instruction
      } else {
        let result = commands[parts[0]](parts[1], labels, instruction)
        blocks.push(result)
        result.forEach((block) => {
          if(block[0] instanceof Array) {
            depends.push(block[0][1][0])
          }
        })
        instruction += 1
      }
    } catch(e) {
      throw `${e} on line ${i+1}.`
    }
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
    binaryTreeOfIf( block.variable.get('EXE PTR'), [0, blocks.length - 1], blocks )[0]
  ).build())
  scripts.tick.depends = depends

  return { scripts: scripts, vars: [ 'EXE PTR', 'R1', 'R2' ], lists: [ 'returns', 'log', 'data' ] }
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
    let mid = Math.floor((range[1] + range[0]) / 2)
    return [ block.ifelse(
      block.gt(compare, mid),
      binaryTreeOfIf(compare, [ mid + 1, range[1] ], parts),
      binaryTreeOfIf(compare, [ range[0], mid ], parts)
    ) ]
  }
}

module.exports = compile
