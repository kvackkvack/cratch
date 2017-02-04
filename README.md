# cratch

This is the very early stages of the base of a project I'm working on that compiles a low-level Assembly-like language to Scratch `.sb2` files.  
The Assembly-like language is named Cratch and has not yet been implemented (nor designed). It's written in `.crs` (`cratch source`) files.  
To store modules (i.e bunches of custom block definitions where only the necessary ones are included) and to transfer stuff between Node (which compiles from `.crs`) and Python (which, with the help of kurt, compiles to `.sb2`), JSON data is stored in `.crc` (`cratch compiled`) files.  
I'll document this format on the wiki at some point.  

As previously stated, only the Python parts are implemented so far.  
The files you, as a user, would be interested in are `sb2/main.py` as well as `sb2/export.py`. `export.py` compiles a `.sb2` to `.crc` (usually used for generating the standard library, `modules.crc`; generated from `std.sb2`) and `main.py` compiles a `.crc` to `.sb2` (including its dependencies, as fetched from the previously-mentioned `modules.crc`).  
Look inside them for further documentation on how to call them.


_written by @kvackkvack for no real reason_
