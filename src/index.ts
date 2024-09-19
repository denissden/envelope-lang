import {compile} from "./compile";

if (typeof window !== 'undefined') {
  document.querySelectorAll('[language="Envelope"]').forEach(convertToJs);
  document.querySelectorAll('[language="envelope"]').forEach(convertToJs);
  document.querySelectorAll('[language="Nvlp"]').forEach(convertToJs);
  document.querySelectorAll('[language="nvlp"]').forEach(convertToJs);
  document.querySelectorAll('[type="text/x-envelope"]').forEach(convertToJs);
  document.querySelectorAll('[type="text/x-nvlp"]').forEach(convertToJs);
}

async function convertToJs(scriptNode: Element) {
  if (scriptNode.parentNode !== null) {
    const nvlpText: string =
      scriptNode.textContent || (await getTxtFromSrc(scriptNode));
    scriptNode.parentNode.removeChild(scriptNode);
    addScriptNode(compile(nvlpText));
  }
}

async function getTxtFromSrc(node: Element) {
  const src = node.getAttribute('src');
  let resp = '';
  if (src !== null && src.length) {
    const fe = await fetch(src, {
      method: 'GET',
    });
    resp = await fe.text();
  }
  return resp;
}

function addScriptNode(compiled: string) {
  const script = document.createElement('script');
  script.innerHTML = compiled;
  document.body.appendChild(script);
}