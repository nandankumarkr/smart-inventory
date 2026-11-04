const fs = require('fs');
const path = require('path');

// Helper to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to parse inline markdown (bold, italic, code) into Word XML runs
function parseInlineRuns(text, defaultSz = 22, defaultColor = "000000", isCode = false) {
  if (isCode) {
    return `<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="${defaultSz}"/><w:szCs w:val="${defaultSz}"/><w:color w:val="${defaultColor}"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
  }

  const runs = [];
  // Regex to match **bold**, *italic*, `code`
  // We can tokenize text into formatting tokens
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      runs.push(`<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${defaultSz}"/><w:szCs w:val="${defaultSz}"/><w:color w:val="${defaultColor}"/></w:rPr><w:t xml:space="preserve">${escapeXml(plain)}</w:t></w:r>`);
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      runs.push(`<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="${defaultSz}"/><w:szCs w:val="${defaultSz}"/><w:color w:val="${defaultColor}"/></w:rPr><w:t xml:space="preserve">${escapeXml(boldText)}</w:t></w:r>`);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      runs.push(`<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:sz w:val="${defaultSz}"/><w:szCs w:val="${defaultSz}"/><w:color w:val="${defaultColor}"/></w:rPr><w:t xml:space="preserve">${escapeXml(italicText)}</w:t></w:r>`);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeText = token.slice(1, -1);
      runs.push(`<w:r><w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="${Math.max(18, defaultSz - 2)}"/><w:szCs w:val="${Math.max(18, defaultSz - 2)}"/><w:color w:val="B91C1C"/><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/></w:rPr><w:t xml:space="preserve">${escapeXml(codeText)}</w:t></w:r>`);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    const plain = text.slice(lastIndex);
    runs.push(`<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${defaultSz}"/><w:szCs w:val="${defaultSz}"/><w:color w:val="${defaultColor}"/></w:rPr><w:t xml:space="preserve">${escapeXml(plain)}</w:t></w:r>`);
  }

  return runs.join('');
}

// Convert a markdown table to Word OpenXML table
function renderTableXml(tableLines) {
  if (tableLines.length < 2) return '';

  const rows = [];
  for (const line of tableLines) {
    // Check if it's separator row | :--- | :--- |
    if (/^\s*\|?\s*:?-+:?\s*\|/.test(line)) continue;
    const cells = line.split('|')
      .slice(1, -1) // remove empty leading/trailing from outer pipes
      .map(c => c.trim());
    if (cells.length > 0) rows.push(cells);
  }

  if (rows.length === 0) return '';
  const colCount = Math.max(...rows.map(r => r.length));
  const tableWidthDxa = 9360;
  const colWidthDxa = Math.floor(tableWidthDxa / colCount);

  let xml = `<w:tbl>
  <w:tblPr>
    <w:tblStyle w:val="TableNormal"/>
    <w:tblW w:w="${tableWidthDxa}" w:type="dxa"/>
    <w:tblLayout w:type="fixed"/>
    <w:tblBorders>
      <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
      <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
      <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
      <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
      <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
      <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
    </w:tblBorders>
  </w:tblPr>
  <w:tblGrid>`;
  for (let i = 0; i < colCount; i++) {
    xml += `<w:gridCol w:w="${colWidthDxa}"/>`;
  }
  xml += `</w:tblGrid>`;

  rows.forEach((row, rowIndex) => {
    const isHeader = rowIndex === 0;
    xml += `<w:tr><w:trPr>${isHeader ? '<w:tblHeader/>' : ''}<w:cantSplit/></w:trPr>`;
    for (let c = 0; c < colCount; c++) {
      const cellText = row[c] || '';
      const bgFill = isHeader ? '0F766E' : (rowIndex % 2 === 1 ? 'FFFFFF' : 'F8FAFC');
      const textColor = isHeader ? 'FFFFFF' : '0F172A';
      xml += `<w:tc>
        <w:tcPr>
          <w:tcW w:w="${colWidthDxa}" w:type="dxa"/>
          <w:shd w:val="clear" w:color="auto" w:fill="${bgFill}"/>
          <w:tcMar>
            <w:top w:w="120" w:type="dxa"/>
            <w:bottom w:w="120" w:type="dxa"/>
            <w:left w:w="140" w:type="dxa"/>
            <w:right w:w="140" w:type="dxa"/>
          </w:tcMar>
        </w:tcPr>
        <w:p>
          <w:pPr>
            <w:spacing w:after="0" w:line="240" w:lineRule="auto"/>
          </w:pPr>
          ${isHeader 
            ? `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="FFFFFF"/></w:rPr><w:t xml:space="preserve">${escapeXml(cellText.replace(/\*\*/g, ''))}</w:t></w:r>`
            : parseInlineRuns(cellText, 19, textColor)}
        </w:p>
      </w:tc>`;
    }
    xml += `</w:tr>`;
  });

  xml += `</w:tbl><w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>`;
  return xml;
}

// Convert a code block to Word OpenXML callout table
function renderCodeBlockXml(codeLines, language = '') {
  let xml = `<w:tbl>
  <w:tblPr>
    <w:tblW w:w="9360" w:type="dxa"/>
    <w:tblLayout w:type="fixed"/>
    <w:tblBorders>
      <w:top w:val="single" w:sz="6" w:space="0" w:color="0F766E"/>
      <w:left w:val="single" w:sz="24" w:space="0" w:color="0F766E"/>
      <w:bottom w:val="single" w:sz="6" w:space="0" w:color="0F766E"/>
      <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
    </w:tblBorders>
  </w:tblPr>
  <w:tblGrid><w:gridCol w:w="9360"/></w:tblGrid>
  <w:tr><w:tc>
    <w:tcPr>
      <w:tcW w:w="9360" w:type="dxa"/>
      <w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/>
      <w:tcMar>
        <w:top w:w="140" w:type="dxa"/>
        <w:bottom w:w="140" w:type="dxa"/>
        <w:left w:w="180" w:type="dxa"/>
        <w:right w:w="180" w:type="dxa"/>
      </w:tcMar>
    </w:tcPr>`;

  for (const line of codeLines) {
    xml += `<w:p>
      <w:pPr>
        <w:spacing w:after="20" w:line="220" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/>
          <w:sz w:val="18"/>
          <w:szCs w:val="18"/>
          <w:color w:val="1E293B"/>
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(line)}</w:t>
      </w:r>
    </w:p>`;
  }

  xml += `</w:tc></w:tr></w:tbl><w:p><w:pPr><w:spacing w:after="140"/></w:pPr></w:p>`;
  return xml;
}

// Convert a screenshot placeholder into a prominent Word callout box
function renderScreenshotBoxXml(caption) {
  return `<w:tbl>
  <w:tblPr>
    <w:tblW w:w="9360" w:type="dxa"/>
    <w:tblLayout w:type="fixed"/>
    <w:tblBorders>
      <w:top w:val="dashed" w:sz="12" w:space="0" w:color="2563EB"/>
      <w:left w:val="dashed" w:sz="12" w:space="0" w:color="2563EB"/>
      <w:bottom w:val="dashed" w:sz="12" w:space="0" w:color="2563EB"/>
      <w:right w:val="dashed" w:sz="12" w:space="0" w:color="2563EB"/>
    </w:tblBorders>
  </w:tblPr>
  <w:tblGrid><w:gridCol w:w="9360"/></w:tblGrid>
  <w:tr><w:tc>
    <w:tcPr>
      <w:tcW w:w="9360" w:type="dxa"/>
      <w:shd w:val="clear" w:color="auto" w:fill="EFF6FF"/>
      <w:tcMar>
        <w:top w:w="240" w:type="dxa"/>
        <w:bottom w:w="240" w:type="dxa"/>
        <w:left w:w="240" w:type="dxa"/>
        <w:right w:w="240" w:type="dxa"/>
      </w:tcMar>
    </w:tcPr>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="80"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:b/>
          <w:sz w:val="24"/>
          <w:szCs w:val="24"/>
          <w:color w:val="1E40AF"/>
        </w:rPr>
        <w:t xml:space="preserve">📷 ${escapeXml(caption)}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:spacing w:after="0"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
          <w:i/>
          <w:sz w:val="20"/>
          <w:szCs w:val="20"/>
          <w:color w:val="3B82F6"/>
        </w:rPr>
        <w:t xml:space="preserve">[Paste screenshot image here after running: npm.cmd run dev &amp; opening http://localhost:3000]</w:t>
      </w:r>
    </w:p>
  </w:tc></w:tr>
</w:tbl><w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>`;
}

module.exports = {
  escapeXml,
  parseInlineRuns,
  renderTableXml,
  renderCodeBlockXml,
  renderScreenshotBoxXml
};
console.log('Parser helpers loaded successfully.');
