const block = require('./block')
      commands = require('./commands')

const nearley = require('nearley'),
      grammar = require('../parse/grammar')

function compile(code) {
  let blocks = [ ], labels = { },
      depends = [ ],
      instruction = 0

  console.log(grammar.ParserStart)
  let parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)

  try {
    code = code.replace(/[\r\n]+/g, '\n')
    parser.feed(code)
  } catch(e) {
    console.log('error')
    throw e // TODO: show more info here
  }

  if(parser.results.length > 1)
    throw 'Ambigious grammar'
  let res = parser.results[0]
  if(res[0] != 'program')
    throw 'Something\'s really wrong here...'
  res = res[1]
  if(res) {
    console.dir(res, { depth: null })
    res.forEach((instr, i) => {
      if(instr[0] == 'label') {
        labels[instr[1][1]] = i
        console.log(labels)
      } else {
        let cmd = commands[instr[1][1]](instr[2] ? instr[2][1] : null, labels)
        blocks.push(cmd)
        cmd.forEach((block) => {
          if(block[0] instanceof Array) {
            depends.push(block[0][1][0])
          }
        })
      }
    })
  }

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
