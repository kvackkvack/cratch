const PythonShell = require('python-shell'),
      path        = require('path')

const args = process.argv.slice(2)
const src  = args[0],
      out  = args[1],
      pyth = args[2]

let python = pyth || process.env.PATH.split(path.delimiter).map(p => p.split(path.sep)).find(p => p[p.length - 1] == 'python.exe')
if(python instanceof Array) {
  python = python.join(path.sep)
} else if(!python) {
  throw `Python couldn't be found in your PATH variable - please supply its global path as a second argument.`
}

let crcout = path.parse(out).name + '.crc'
require('./compile/main')(src, crcout)

PythonShell.run('main.py', {
  mode: 'text',
  pythonPath: python,
  pythonOptions: [ '-u' ],
  scriptPath: __dirname + '/sb2',
  args: [ crcout, out ]
}, (err, results) => {
  if(err) throw err

  if(results) {
    results.forEach((res) => {
      console.log(res)
    })
  }
})
