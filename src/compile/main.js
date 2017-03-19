/*
  Called with 2 arguments, the latter optional:
    in: the .crs file to turn into a .crc
    out: optional, path to the outputted .crc file; defaults to `out.crc`
 */

const compile = require('./compile'),
      fs = require('fs')

const args = process.argv.slice(2)

fs.readFile(args[0], 'utf8', (err, data) => {
  if(err) throw err

  let res = compile(data)

  fs.writeFile(args[1] || 'out.crc', JSON.stringify(res), (err) => {
    if(err) throw err
  })
})
