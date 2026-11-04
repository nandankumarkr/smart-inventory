const fs = require('fs');

const docXml = fs.readFileSync('C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml', 'utf8');

// Where does "NOTE: all the below sections" appear?
const noteIdx = docXml.indexOf('NOTE: all the below sections');
console.log('noteIdx:', noteIdx);

if (noteIdx !== -1) {
  // Find the start of the paragraph containing this note
  const pStart = docXml.lastIndexOf('<w:p', noteIdx);
  console.log('Paragraph start for NOTE:', pStart);
  
  // Find where </w:body> is
  const bodyEnd = docXml.indexOf('</w:body>');
  console.log('Body end:', bodyEnd);
  
  // Everything before pStart is the front matter (Title, Certificate, Declaration, Ack, TOC, List of Tables, List of Figures)
  console.log('Front matter length:', pStart);
  console.log('Template chapters length to be replaced:', bodyEnd - pStart);
}
