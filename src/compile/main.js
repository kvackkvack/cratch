/*
  Called with 2 arguments, the latter optional:
    in: the .crs file to turn into a .crc
    out: optional, path to the outputted .crc file; defaults to `out.crc`
 */

const compile = require('./compile'),
      args = process.argv.slice(1)

// TODO: this file lol

let res = compile('')
console.dir(res, { depth: null })
console.log(JSON.stringify(res))
