const fs = require('fs');

const md = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/smart-inventory/docs/PES_UNIVERSITY_PROJECT_REPORT.md', 'utf8');

const ch1Idx = md.indexOf('# CHAPTER 1');
console.log('Chapter 1 index in MD:', ch1Idx);

const chapters = md.slice(ch1Idx);
console.log('Total characters from Chapter 1 to end:', chapters.length);
console.log('First 300 chars of chapters:\n', chapters.slice(0, 300));
