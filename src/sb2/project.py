# Called by main.py. I swear it was a good idea to seperate this into two files at some point.

from kurt import kurt
from cio import extract_scripts, extract_vars
import json, os

def compile(main):
    proj = make_project()
    sprite = proj.sprites[0]
    main = json.loads(main)

    extract_scripts(main['scripts'], sprite, get_modules())
    extract_vars(main['vars'], main['lists'], sprite)

    return proj

def make_project():
    p = kurt.Project()
    s = kurt.Sprite(p, 'main')
    p.sprites.append(s)
    return p

def get_modules():
    with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'modules.crc'), 'r') as fp:
        f = fp.read()
        return json.loads(f)
