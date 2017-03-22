@{%

function parsenum(num, radix = 10) {
  if(radix != 10) {
    if(num.indexOf('.') > -1) throw 'Numbers not in base 10 may not be floating point.'
    return Number.parseInt(num, radix)
  } else {
    return Number.parseFloat(num)
  }
}

%}

@builtin "whitespace.ne"

Program -> statement_list {% r => ['program', r[0]] %}
         | _ {% r => ['program', null] %}
statement_list -> _ Statement _ {% r => [r[1]] %}
                | _ Statement [\r\n]:+ statement_list {% r => [r[1], ...r[3]] %}

Statement -> _statement (_ Comment):? {% id %}
           | Comment {% r => null %}
_statement -> Label {% r => ['label', ...r[0]] %}
           | Identifier {% r => ['call', r[0], null] %}
           | Identifier ProgramWS Value {% r => ['call', r[0], r[2][0]] %}
Identifier -> [^:\s\d#"'`]:+ {% r => ['ident', r[0].join('')] %}
Label -> Identifier ":"

Value -> String
       | Identifier
       | Number

String -> "\"" _strchar:+ "\"" {% r => ['string', r[1].join('')] %}
_strchar -> [^\\"]
          | "\\" [^] {% r => JSON.parse('"' + r[0] + r[1] + '"') %}

Number -> _number {% r => ['number', parsenum(r[0], 10)] %}
        | "0x" _number {% r => ['number', parsenum(r[1], 16)] %}
        | "0b" _number {% r => ['number', parsenum(r[1], 2)] %}
        | _number ":" Integer {% r => ['number', parsenum(r[0], r[2])] %}
_number -> Integer {% id %}| Float {% id %}
Float -> Integer:? "." Integer {% r => `${r[0]}${r[1]}${r[2]}` %}
Integer -> [\d]:+ {% r => r[0].join('') %}

Comment -> SLComment | MLComment
SLComment -> "#" [^\r\n:] [^\r\n]:* {% r => r[1] + r[2] %}
           | "#" {% r => null %}
MLComment -> "#:" _mlchar:* ":#"
_mlchar -> [^:]
         | ":" [^#]

ProgramWS -> ([ \t\v\f] | MLComment):+
