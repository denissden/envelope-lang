import polyfill from 'globalthis';
// import {parser} from "./language";

export function compile(text: string) {
  let result = text
  if (!text.match(/\/\/\s*debug[\s_]*disable/)) {
    result = addEmojiDebug(result)
  }
  result = addErrVariable(result)
  return result
}

export function addEmojiDebug(text: string) {
  const emojis = ["💌", "👉", "🌭", "😂", "🥵"]
  const lines: string[] = []
  let ix = 1;
  text.split("\n").forEach(line => {
    lines.push(`console.log("${ix} ${emojis[ix % emojis.length]}" + ${JSON.stringify(line)});`)
    lines.push(line)
    ix++
  })
  return lines.join("\n")
}

export function addErrVariable(text: string) {
  const lines: string[] = []
  const singleLineExpr = /^\s*(\w+),\s*((e|er|err|error)[\w*])\s*=(.*)/g
  const multilineExprStart = /^\s*(\w+),\s*((e|er|err|error)[\w*])\s*=\s*#\s*(.*)/g
  const multilineExprEnd = /^\s*#/g

  text.split("\n").forEach(line => {
    const M_singleLineExpr = Array.from(line.matchAll(singleLineExpr))
    const M_multilineExprStart = Array.from(line.matchAll(multilineExprStart))
    const M_multilineExprEnd = Array.from(line.matchAll(multilineExprEnd))
    console.log(M_singleLineExpr)
    console.log(M_multilineExprStart)
    console.log(M_multilineExprEnd)
    let errorNames: string[] = []
    if (M_multilineExprStart.length > 0) {
      const variableName = M_multilineExprStart[0][1]
      const errorName = M_multilineExprStart[0][2]
      const code = M_multilineExprStart[0][4]
      errorNames.push(errorName)
      lines.push(wrapErrorStart(variableName, errorName, code))
    }
    else if (M_singleLineExpr.length > 0) {
      const variableName = M_singleLineExpr[0][1]
      const errorName = M_singleLineExpr[0][2]
      const code = M_singleLineExpr[0][4]
      lines.push(wrapErrorStart(variableName, errorName, code) + "\n" + wrapErrorEnd(errorName))
    }
    else if (M_multilineExprEnd.length > 0) {
      const errorName = errorNames.pop()!
      lines.push(wrapErrorEnd(errorName))
    }
    else {
      lines.push(line)
    }
  })
  return lines.join("\n")
}

function wrapErrorStart(variableName: string, errorName: string, code: string) {
  return `let { ${variableName}, ${errorName} } = [null, null];
try { 
  ${variableName} =${code}`
}

function wrapErrorEnd(errorName: string) {
  const errIx = Math.floor(Math.random() * 1000000)
  return `} catch (env_err_${errIx}) {
  ${errorName} = env_err_${errIx};
}`
}

const globalThis = polyfill() as any;
globalThis.envelope = compile;