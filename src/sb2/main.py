# Called with 2 arguments, the latter optional:
#   in: a .crc file to turn into a .sb2
#   out: optional, the path to the outputted .sb2; defaults to `out.sb2`

from project import compile
from cio import extract_script
import json, sys, os

if(len(sys.argv) <= 1):
    raise IndexError('At least 1 argument must be provided')
path = sys.argv[1]
if not os.path.isabs(path):
    path = os.path.abspath(path)
with open(path) as f:
    project = compile(f.read())
    project.save(sys.argv[2] if len(sys.argv) > 2 else 'out.sb2')
