import * as P from 'parsimmon'

export const parser = P.createLanguage({
  expression: rules =>
    P.alt(rules.stringSingleQuote, rules.stringDoubleQuote, rules.number, rules.symbol, rules.list),
  symbol: () => P.regexp(/[a-zA-Z_|=:+*/`.?<>%&~!-][=a-zA-Z0-9_=|:+*/`.?<&>%!~-]*/).desc('symbol'),
  comma: () => P.string(","),
  stringSingleQuote: () =>
    P
      .regexp(/'((?:\\.|.)*?)'/, 1)
      .map(string => `'${string}'`)
      .desc('string'),
  stringDoubleQuote: () =>
    P
      .regexp(/"((?:\\.|.)*?)"/, 1)
      .map(string => `"${string}"`)
      .desc('string'),
  number: () =>
    P
      .regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)
      .map(Number)
      .desc('number'),
  list: rules => rules.expression.trim(P.optWhitespace).many().wrap(P.string('('), P.string(')')),
  document: rules => rules.expression.trim(P.optWhitespace).many()})