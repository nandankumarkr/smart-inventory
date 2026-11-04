const fs = require('fs');

const docXml = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8');

// Print all paragraphs with their text and pStyle
const pRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
let pMatch;
let index = 0;
while ((pMatch = pRegex.exec(docXml)) !== null) {
  const pContent = pMatch[1];
  const pStyleMatch = pContent.match(/<w:pStyle w:val="([^"]+)"/);
  const pStyle = pStyleMatch ? pStyleMatch[1] : 'Normal';
  const textMatches = pContent.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
  const text = textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
  if (text.trim().length > 0) {
    console.log(`[P ${index++}] [${pStyle}] ${text.trim().slice(0, 80)}`);
  }
}
