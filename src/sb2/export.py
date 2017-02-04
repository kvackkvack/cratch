# Called with 2 arguments, the latter optional:
#   in: a .sb2 file to turn into a .crc
#   out: optional, path to the outputted .crc; defaults to `src/sb2/modules.crc`

import os, sys, json
from cio import build_scripts
from kurt import kurt

def export(project):
    return json.dumps(build_scripts(project.sprites[0].scripts))

path = sys.argv[2] if len(sys.argv) > 2 else 'src/sb2/modules.crc'
if not os.path.isabs(path):
    path = os.path.abspath(path)
with open(path, 'wb') as fp:
    fp.write(export(kurt.Project.load(sys.argv[1])))
