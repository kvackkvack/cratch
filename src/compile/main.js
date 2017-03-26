/*
  Called with 2 arguments, the latter optional:
    in: the .crs file to turn into a .crc
    out: optional, path to the outputted .crc file; defaults to `out.crc`
 */

const compile = require('./compile'),
      fs = require('fs')

const args = process.argv.slice(2)

function main(src, out = 'out.crc') {
  console.log(src, out)
  
  fs.readFile(src, 'utf8', (err, data) => {
    if(err) throw err

    let res = compile(data)

    fs.writeFile(out, JSON.stringify(res), (err) => {
      if(err) throw err
    })
  })
}

// if require.main == this files module , we're running via `node`
if(require.main == module)
  main(args[0], args[1])
else
  module.exports = main
