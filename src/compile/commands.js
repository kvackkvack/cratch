/*
 *
 * TYPES:
 * - Scratch String (sstr) - Uses scratch's built in operators and way of storing strings, thus being the fastest type of string.
 * - Scratch Number (snum) - Uses scratch's built in operators and way of storing numbers, thus being the fastest type of number.
 *
 * A type's custom blocks follow the pattern T<type>_<submethod>. The constructor submethod is called "make".
 * Commands (and thus also type custom blocks) are not to be defined as custom blocks in all cases; shorter commands should instead be inserted directly.
 *
 */

const block = require('./block')

let commands = {}
commands = {
  // sstr
  'sstr': (val) => [
    block.list.add('returns', val.toString())
  ],
  'sstr.print': () => [
    block.list.add('log', block.list.item('returns', block.list.LAST)),
    block.list.remove('returns', block.list.LAST)
  ],
  'sstr.join': () => [
    block.custom.call([ 'Tsstr_join' ])
  ],
  'sstr.len': () => [
    block.list.add('returns', block.length( block.list.item('returns', block.list.LAST) ))
  ],
  'sstr.char': () => [
    block.list.add('returns', block.letterof(  ))
  ],

  // snum
  'snum': (val) => [
    block.list.add('returns', val.toString())
  ],
  'snum.print': () => [
    block.list.add('log', block.list.item('returns', block.list.LAST)),
    block.list.remove('returns', block.list.LAST)
  ],
  'snum.add': () => [
    block.custom.call([ 'Tsnum_add' ])
  ],

  // memory
  'mem': (n) => [ // add n pieces of memory
    block.repeatn(
      n, [ block.list.add('data', '') ]
    )
  ],
  'put': (idx) => [ // write the last return to a memory location
    block.list.replace('data', block.list.item('returns', block.list.LAST), idx + 1),
    block.list.remove('returns', block.list.LAST)
  ],
  'putr': (idx) => [ // put and return
    block.list.replace('data', block.list.item('returns', block.list.LAST), idx + 1)
  ],
  'get': (idx) => [
    block.list.add('returns', block.list.item('data', idx + 1))
  ],

  // jumps
  'jmpl': (label, labels) => [
    block.variable.set('EXE PTR', labels[label] - 1)
  ]
}

module.exports = commands
