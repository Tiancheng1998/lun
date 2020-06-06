function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function callback(responseText) {
    document.getElementById('lun').innerHTML += "\n<link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/styles/github.min.css'>\n\
    <script src='//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/highlight.min.js' crossorigin='anonymous'></script>\n\
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css'>"
    document.getElementById('comment').innerHTML = responseText
}

httpGetAsync('output.html', callback);
