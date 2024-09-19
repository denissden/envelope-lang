import polyfill from 'globalthis';

export function compile(text: string) {
  return "// envelope works\n" + text
}

const globalThis = polyfill() as any;
globalThis.envelope = compile;