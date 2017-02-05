# cratch

This is the very early stages of the base of a project I'm working on that compiles a low-level Assembly-like language to Scratch `.sb2` files.  
The Assembly-like language is named Cratch and has not yet been fully implemented (nor designed). It's written in `.crs` (`cratch source`) files.  
To store modules (i.e bunches of custom block definitions where only the necessary ones are included) and to transfer stuff between Node (which compiles from `.crs`) and Python (which, with the help of kurt, compiles to `.sb2`), JSON data is stored in `.crc` (`cratch compiled`) files.  
I'll document this format on the wiki at some point.  

## how to run
Compiling from a `.crs` to a `.sb2` consists of 2 steps - first, compiling the `.crs` to a `.crc` using Node, and then the `.crc` to a `.sb2` using Python. I'll automate this process at some point.  

### node
This part is still very much in beta, but for now all you need to run is `compile/main.js`. Since `.crs` files are not yet implemented, it currently takes no arguments. It will instead print out the results of compiling an empty `.crs` file.   

### python
The files you, as a user, would be interested in are `sb2/main.py` as well as `sb2/export.py`. `export.py` compiles a `.sb2` to `.crc` (usually used for generating the standard library, `modules.crc`; generated from `std.sb2`) and `main.py` compiles a `.crc` to `.sb2` (including its dependencies, as fetched from the previously-mentioned `modules.crc`).  
Thus, for compiling a `.crs` to a `.sb2`, after running the Node script `main.py` is what you'll want to run.  
Look inside them for further documentation on how to call them.


_written by @kvackkvack for no real reason_
