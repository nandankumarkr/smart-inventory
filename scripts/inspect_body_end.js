const fs = require('fs');

const docXml = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8');
const bodyEnd = docXml.indexOf('</w:body>');
console.log('Last 800 chars before </w:body>:\n', docXml.slice(bodyEnd - 800, bodyEnd));
