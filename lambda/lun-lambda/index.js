const fs = require('fs');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const katex = require('markdown-it-katex');
const highlight = require('markdown-it-highlightjs');
const markdownIt = require('markdown-it')()
    .use(katex)
    .use(highlight);

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const input = fs.readFileSync('./input.md', {encoding:'utf8', flag:'r'});

markdownIt.set({
    html: true,
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true,
});

const result = DOMPurify.sanitize(markdownIt.render(input));

fs.writeFileSync('./output.html', result);
