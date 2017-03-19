# cratch

This is the very early stages of the base of a project I'm working on that compiles a low-level Assembly-like language to Scratch `.sb2` files.  
The Assembly-like language is named Cratch and has not yet been fully implemented (nor designed). It's written in `.crs` (`cratch source`) files.  
To store modules (i.e bunches of custom block definitions where only the necessary ones are included) and to transfer stuff between Node (which compiles from `.crs`) and Python (which, with the help of kurt, compiles to `.sb2`), JSON data is stored in `.crc` (`cratch compiled`) files.  
I'll document this format on the wiki at some point.  

## how to run
Compiling from a `.crs` to a `.sb2` consists of 2 steps - first, compiling the `.crs` to a `.crc` using Node, and then the `.crc` to a `.sb2` using Python. I'll automate this process at some point.  

### cool, but shut up; I just want something that works
Ok.  
`node compile/main.js <myfile.crs> && python sb2/main.py out.crc <outpath.sb2>`
Obviously, replace `<myfile.crs>` and `<outpath.sb2>` with the relevant files. You should then be able to open `outpath.sb2`; just click the green flag and the program should do the rest. :tada:

### I want a more thorough explanation  
Great!  
Take a look at [the wiki article](../../wiki/Build). Create an issue or contact me otherwise if you need further clarification.

_written by @kvackkvack for no real reason_
