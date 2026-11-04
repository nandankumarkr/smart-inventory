const fs = require('fs');

let frontMatter = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8').slice(0, 169625);

// Let's check occurrences of names and titles in frontMatter
const terms = [
  'TITLE',
  'T. Lohith Srinivas',
  'fghdfjjkshjdhs',
  'PES2UG19CS203',
  'Shilpa',
  'Disasters',
  'UE24CSS351A',
  'ABSTRACT'
];

for (const term of terms) {
  let count = 0;
  let pos = 0;
  while ((pos = frontMatter.indexOf(term, pos)) !== -1) {
    count++;
    pos += term.length;
  }
  console.log(`Term "${term}": ${count} occurrences`);
}
