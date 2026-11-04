const fs = require('fs');

const frontMatter = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8').slice(0, 169625);

function showSnippet(term) {
  let pos = frontMatter.indexOf(term);
  while (pos !== -1) {
    const start = Math.max(0, frontMatter.lastIndexOf('<w:p', pos));
    const end = frontMatter.indexOf('</w:p>', pos) + 6;
    console.log(`\n=== Snippet for "${term}" (at ${pos}) ===`);
    console.log(frontMatter.slice(start, end).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    pos = frontMatter.indexOf(term, pos + 1);
  }
}

showSnippet('TITLE');
showSnippet('fghdfjjkshjdhs');
showSnippet('ABSTRACT');
