const fs = require('fs');
const katex = require('markdown-it-katex');
const highlight = require('markdown-it-highlightjs');
const markdownIt = require('markdown-it')()
    .use(katex)
    .use(highlight);

const input = fs.readFileSync('./input.md', {encoding:'utf8', flag:'r'});

markdownIt.set({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
});

var result = markdownIt.render(input);

// console.log(result);

fs.writeFileSync('./output.html', result);
