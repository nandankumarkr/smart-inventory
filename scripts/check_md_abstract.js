const fs = require('fs');

const md = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/smart-inventory/docs/PES_UNIVERSITY_PROJECT_REPORT.md', 'utf8');

const absIdx = md.indexOf('## ABSTRACT');
const tocIdx = md.indexOf('## TABLE OF CONTENTS');
console.log('Abstract text:\n', md.slice(absIdx, tocIdx));
