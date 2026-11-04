const fs = require('fs');

const stylesXml = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/styles.xml', 'utf8');
const styles = stylesXml.matchAll(/<w:style[^>]*w:styleId="([^"]+)"[^>]*>[\s\S]*?<w:name w:val="([^"]+)"/g);
for (const s of styles) {
  console.log(s[1], '-->', s[2]);
}

const docXml = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8');
const tables = docXml.match(/<w:tbl[\s\S]*?<\/w:tbl>/g) || [];
console.log('Tables in template:', tables.length);
if (tables.length > 0) {
  console.log('Sample table XML preview (first 500 chars):\n', tables[0].slice(0, 500));
}
