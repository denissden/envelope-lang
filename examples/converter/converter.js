document.getElementById('envelope').addEventListener('keyup', convert, false)


function convert() {
    const text = document.getElementById('envelope').value;
    document.getElementById('js').value = envelope(text);
}