// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


function parsenum(num, radix = 10) {
  if(radix != 10) {
    if(num.indexOf('.') > -1) throw 'Numbers not in base 10 may not be floating point.'
    return Number.parseInt(num, radix)
  } else {
    return Number.parseFloat(num)
  }
}

var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["wschar", "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["wschar", "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "Program", "symbols": ["statement_list"], "postprocess": r => ['program', r[0]]},
    {"name": "Program", "symbols": ["_"], "postprocess": r => ['program', null]},
    {"name": "statement_list", "symbols": ["_", "Statement", "_"], "postprocess": r => [r[1]]},
    {"name": "statement_list$ebnf$1", "symbols": [/[\r\n]/]},
    {"name": "statement_list$ebnf$1", "symbols": [/[\r\n]/, "statement_list$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "statement_list", "symbols": ["_", "Statement", "statement_list$ebnf$1", "statement_list"], "postprocess": r => [r[1], ...r[3]]},
    {"name": "Statement", "symbols": ["Label"], "postprocess": r => ['label', ...r[0]]},
    {"name": "Statement", "symbols": ["Identifier"], "postprocess": r => ['call', r[0], null]},
    {"name": "Statement$ebnf$1", "symbols": [/[ \t\v\f]/]},
    {"name": "Statement$ebnf$1", "symbols": [/[ \t\v\f]/, "Statement$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Statement", "symbols": ["Identifier", "Statement$ebnf$1", "Value"], "postprocess": r => ['call', r[0], r[2][0]]},
    {"name": "Identifier$ebnf$1", "symbols": [/[^:\s\d"'`]/]},
    {"name": "Identifier$ebnf$1", "symbols": [/[^:\s\d"'`]/, "Identifier$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Identifier", "symbols": ["Identifier$ebnf$1"], "postprocess": r => ['ident', r[0].join('')]},
    {"name": "Label", "symbols": ["Identifier", {"literal":":"}]},
    {"name": "Value", "symbols": ["String"]},
    {"name": "Value", "symbols": ["Identifier"]},
    {"name": "Value", "symbols": ["Number"]},
    {"name": "String$ebnf$1", "symbols": ["_strchar"]},
    {"name": "String$ebnf$1", "symbols": ["_strchar", "String$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "String", "symbols": [{"literal":"\""}, "String$ebnf$1", {"literal":"\""}], "postprocess": r => ['string', r[1].join('')]},
    {"name": "_strchar", "symbols": [/[^\\"]/]},
    {"name": "_strchar", "symbols": [{"literal":"\\"}, /[^]/], "postprocess": r => JSON.parse('"' + r[0] + r[1] + '"')},
    {"name": "Number", "symbols": ["_number"], "postprocess": r => ['number', parsenum(r[0], 10)]},
    {"name": "Number$string$1", "symbols": [{"literal":"0"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Number", "symbols": ["Number$string$1", "_number"], "postprocess": r => ['number', parsenum(r[1], 16)]},
    {"name": "Number$string$2", "symbols": [{"literal":"0"}, {"literal":"b"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Number", "symbols": ["Number$string$2", "_number"], "postprocess": r => ['number', parsenum(r[1], 2)]},
    {"name": "Number", "symbols": ["_number", {"literal":":"}, "Integer"], "postprocess": r => ['number', parsenum(r[0], r[2])]},
    {"name": "_number", "symbols": ["Integer"], "postprocess": id},
    {"name": "_number", "symbols": ["Float"], "postprocess": id},
    {"name": "Float$ebnf$1", "symbols": ["Integer"], "postprocess": id},
    {"name": "Float$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Float", "symbols": ["Float$ebnf$1", {"literal":"."}, "Integer"], "postprocess": r => `${r[0]}${r[1]}${r[2]}`},
    {"name": "Integer$ebnf$1", "symbols": [/[\d]/]},
    {"name": "Integer$ebnf$1", "symbols": [/[\d]/, "Integer$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Integer", "symbols": ["Integer$ebnf$1"], "postprocess": r => r[0].join('')}
]
  , ParserStart: "Program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
