/*
 *
 * TYPES:
 * - Scratch String (sstr) - uses scratch's built in operators and way of storing strings, thus being the fastest type of string.
 *
 * | a type's custom blocks follow the pattern T<type>_<submethod>. the constructor submethod is called "make".
 *
 */

const block = require('./block')

const commands = {
  'sstr': val => [
    block.list.add('returns', val.toString())
  ],
  'sstr.print': str => [
    block.list.add('log', block.list.item('returns', block.list.LAST)),
    block.list.remove('returns', block.list.LAST)
  ]
}

module.exports = commands
