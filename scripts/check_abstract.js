const fs = require('fs');

const frontMatter = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8').slice(0, 169625);
const absPos = frontMatter.indexOf('ABSTRACT');
const tocPos = frontMatter.indexOf('TABLE OF CONTENTS');
console.log('Chars between ABSTRACT and TOC:', tocPos - absPos);
console.log('Snippet between ABSTRACT and TOC:\n', frontMatter.slice(absPos - 100, tocPos).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
