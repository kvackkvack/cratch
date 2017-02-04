function compile(string) {
  let scripts = {}

   const lines = string.split(/;\s*/g)
   lines.forEach((line) => {
     const parts = line.split(/\s+/g)
     commands[line[0]](line[1])
   })
}
