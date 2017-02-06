# Called with 2 arguments, the latter optional:
#   in: a .sb2 file to turn into a .crc
#   out: optional, path to the outputted .crc; defaults to `src/sb2/modules.crc`

import os, sys, json
from cio import build_scripts, build_vars
from kurt import kurt

def export(project):
    out = build_scripts(project.sprites[0].scripts)
    built_vars = build_vars(project.sprites[0].variables, project.sprites[0].lists)
    out['vars'] = built_vars['vars']
    out['lists'] = built_vars['lists']
    return json.dumps(out)

path = sys.argv[2] if len(sys.argv) > 2 else 'src/sb2/modules.crc'
if not os.path.isabs(path):
    path = os.path.abspath(path)
with open(path, 'wb') as fp:
    fp.write(export(kurt.Project.load(sys.argv[1])))
