# The main body of this directory
# Supplies functions for compiled (JSON, .crc) code -> kurt data and vice versa for various kurt objects (most notably blocks, scripts and sprites)

from kurt import kurt

def build_arg(arg):
    # Turn a block argument into a data dictionary
    if type(arg) is kurt.Block:
        return build_block(arg)
    elif type(arg) is list:
        for i in range(len(arg)):
            arg[i] = build_arg(arg[i])
    return arg

def build_parts(parts):
    ret = []
    for part in parts:
        if type(part) is kurt.Insert:
            ret.append([part.shape, part.default, part.name])
        else:
            ret.append(part)
    return ret
def parse_parts(parts):
    ret = []
    for part in parts:
        if type(part) is list:
            ret.append(kurt.Insert(part[0], default=part[1], name=part[2]))
        else:
            ret.append(part)
    return ret

def build_block(block):
    # Turn a kurt.Block into a data list with the block name + all arguments
    ret = None
    if type(block.type) is kurt.CustomBlockType:
        ret = [[block.type.shape, build_parts(block.type.parts)]]
    else:
        ret = [block.type.stripped_text]
    for arg in block.args:
        ret.append(build_arg(arg))
    return ret

def parse_block(block):
    # Turn a data list into a kurt.Block
    for i in range(len(block)):
        if type(block[i]) is list:
            if block[i][0] == 'stack':
                # we're a custom block definition
                block[i] = kurt.CustomBlockType(block[i][0], parse_parts(block[i][1]))
            else:
                block[i] = parse_block(block[i])
    # TODO: fix this DIRTY hack (maybe)
    if(type(block[0]) is kurt.Block):
        # We're already a list of blocks; let's just send this over (we're probably an argument to a C-block)
        return block
    else:
        return kurt.Block(*block) # Send every item of block as an argument


def build_script(script):
    # Turn a kurt.Script into a data dictionary of:
    #   script: list of `build_block` lists
    #   depends: list of names of custom blocks this script relies on
    #   type: define or main; whether this is a custom block or the green flag event
    #   name: the name; first word of a custom blocks name or just "flag" for green flag events
    #   head: only for custom blocks; all the parts of the custom block definition (strings and kurt.Inserts)
    #   pos: OPTIONAL; object of x and y, the script's position in the editor

    out = { 'script': [], 'depends': [] }
    isCustomBlockDef = len(script.blocks[0].args) >= 1 and type(script.blocks[0].args[0]) is kurt.CustomBlockType

    for block in script.blocks[1:]:
        out['script'].append(build_block(block))
        if type(block.type) is kurt.CustomBlockType and (not isCustomBlockDef or not script.blocks[0].args[0].parts[0].strip() == block.type.parts[0].strip()):
            (out['depends']).append(block.type.parts[0].strip())

    if isCustomBlockDef:
        out['type'] = 'define'
        out['name'] = script.blocks[0].args[0].parts[0].strip()
        out['head'] = build_parts(script.blocks[0].args[0].parts)
    else:
        out['type'] = 'main'
        out['name'] = 'flag'

    return out


def extract_script(script, sprite, mods):
    # Extract the scripts of a `build_script` dictionary into a certain sprite
    if script['type'] == 'main':
        # for extracting the main script of a project
        sprite.scripts.append(generate_script(
            kurt.Block('whenGreenFlag'),
            script['script'],
            (script['pos']['x'], script['pos']['y']) if 'pos' in script else (0, 0)))
    elif script['type'] == 'define':
        # for custom module definitions
        print script
        news = generate_script(
            kurt.Block('procDef', kurt.CustomBlockType('stack', parse_parts(script['head']))),
            script['script'],
            (script['pos']['x'], script['pos']['y']) if 'pos' in script else (800, 0))
        news.is_atomic = True
        sprite.scripts.append(news)

    extract_dependencies(script['depends'], sprite, mods)
    return sprite
def generate_script(head, tail, where):
    # Helper function for extract_script
    ret = kurt.Script([ head ], where)
    for block in tail:
        ret.blocks.append(parse_block(block))
    return ret
def extract_dependencies(depends, sprite, mods):
    # Helper function for extract_script
    if(len(depends) > 0):
        for depend in depends:
            mod = mods[depend]
            assert(mod is not None)
            extract_script(mod, sprite, mods)

def build_scripts(scripts):
    # Turn a list of kurt.Scripts (sprite.scripts) into a data dictionary of `build_script`s like this:
    # For the `build_script` value *b*, the key *b*.name is connected to *b*
    out = {}
    for script in scripts:
        if script.blocks[0].type.stripped_text == 'define' or script.blocks[0].type.stripped_text == 'when@greenflagclicked':
            built = build_script(script)
            out[built['name']] = built
    return out

def extract_scripts(scripts, sprite, mods):
    # Extract all scripts of a `build_scripts` dictionary into a certain sprite
    for key in scripts:
        extract_script(scripts[key], sprite, mods)

def extract_vars(varis, lists, sprite):
    # Extract all variables and lists into a certain Kurt sprite
    for var in varis:
        sprite.variables[var] = kurt.Variable()
    for slist in lists:
        sprite.lists[slist] = kurt.List()

def build_vars(varis, lists):
    out = { 'vars': [], 'lists': [] }
    for var in varis.iterkeys():
        out.vars.append('var')
    for slist in lists.iterkeys():
        out.lists.append('slist')
    return out
