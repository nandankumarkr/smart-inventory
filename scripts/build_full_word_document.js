const fs = require('fs');
const path = require('path');
const {
  escapeXml,
  parseInlineRuns,
  renderTableXml,
  renderCodeBlockXml,
  renderScreenshotBoxXml
} = require('./doc_helpers');

console.log('Starting Word document generation...');

const templateDocXmlPath = 'C:/Users/nk953/.gemini/antigravity/scratch/docx_template/word/document.xml';
let docXml = fs.readFileSync(templateDocXmlPath, 'utf8');

const noteIdx = docXml.indexOf('NOTE: all the below sections');
if (noteIdx === -1) {
  throw new Error('Could not find split point in template document.xml');
}
const pStart = docXml.lastIndexOf('<w:p', noteIdx);
const bodyEnd = docXml.indexOf('</w:body>');

let frontMatter = docXml.slice(0, pStart);
const sectPrAndEnd = docXml.slice(docXml.lastIndexOf('<w:sectPr', bodyEnd));

// 1. Update Front Matter placeholders
frontMatter = frontMatter.replace(/>TITLE</g, '>SMART INVENTORY &amp; AUTOMATED RESTOCK PREDICTOR<');
frontMatter = frontMatter.replace(/Disasters data Management System/g, 'Smart Inventory &amp; Automated Restock Predictor');
frontMatter = frontMatter.replace(/Disasters Data Management System/g, 'Smart Inventory &amp; Automated Restock Predictor');
frontMatter = frontMatter.replace(/T\. Lohith Srinivas/g, 'Nandan Kumar');
frontMatter = frontMatter.replace(/fghdfjjkshjdhs/g, 'PES2UG23CS953');
frontMatter = frontMatter.replace(/PES2UG19CS203/g, 'PES2UG23CSXXX');
frontMatter = frontMatter.replace(/Dr\.\s*Shilpa\s*S/g, 'Dr. Nagasundari S');
frontMatter = frontMatter.replace(/Dr\.\s*Shilpa/g, 'Dr. Nagasundari S');
frontMatter = frontMatter.replace(/Shilpa\s*S/g, 'Nagasundari S');

// Insert abstract paragraphs right after ABSTRACT
const absPlaceholder = 'ABSTRACT</w:t></w:r></w:p>';
if (frontMatter.includes(absPlaceholder)) {
  const abstractParas = `
<w:p>
  <w:pPr>
    <w:spacing w:before="240" w:after="160" w:line="276" w:lineRule="auto"/>
    <w:jc w:val="both"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">Traditional enterprise inventory systems operate primarily as basic Create-Read-Update-Delete (CRUD) data stores, tracking flat scalar quantities without physical lot differentiation. In high-velocity multi-warehouse supply chains, this architecture leads to critical operational failures: race conditions and overselling during concurrent checkouts, lack of lot-level expiration tracking causing millions in spoiled perishables, rigid keyword search unable to resolve semantic inquiries, and absence of predictive automated replenishment.</w:t>
  </w:r>
</w:p>
<w:p>
  <w:pPr>
    <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
    <w:jc w:val="both"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">To address these challenges, this project presents the </w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">Smart Inventory &amp; Automated Restock Predictor (SIMS)</w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">, a high-performance multi-paradigm database system built on </w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">PostgreSQL 18</w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">, </w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">pgvector</w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">, and </w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">NoSQL JSONB</w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">, coupled with a responsive </w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">Next.js 14</w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve"> web application.</w:t>
  </w:r>
</w:p>
<w:p>
  <w:pPr>
    <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
    <w:jc w:val="both"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">The relational core comprises 14 normalized tables in Boyce-Codd Normal Form (BCNF), utilizing an append-only double-entry inventory ledger (inventory_transactions) to guarantee strict non-repudiation. Concurrency control and overselling prevention are enforced using ACID transactions with row-level locking (SELECT ... FOR UPDATE) in stored procedures (sp_execute_stock_transfer, sp_fulfill_order_fifo). Automated batch picking utilizes a First-In, First-Out (FIFO) algorithm prioritized by earliest expiration dates.</w:t>
  </w:r>
</w:p>
<w:p>
  <w:pPr>
    <w:spacing w:after="160" w:line="276" w:lineRule="auto"/>
    <w:jc w:val="both"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">A predictive analytics engine (vw_daily_burn_rate_and_restock_predictor) calculates 14-day consumption burn rates, forecasting days until complete stockout. When safety thresholds are breached, a row-level database trigger (trg_auto_generate_purchase_order) automatically generates draft purchase orders directed to preferred vendors. For unstructured catalog inquiries and customer sentiment analysis, the system integrates dense 384-dimensional vector embeddings with Hierarchical Navigable Small World (HNSW) indexing and Cosine Distance, grouping items based on review sentiment polarity.</w:t>
  </w:r>
</w:p>
<w:p>
  <w:pPr>
    <w:spacing w:after="240" w:line="276" w:lineRule="auto"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">Keywords: </w:t>
  </w:r>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:i/><w:sz w:val="22"/><w:szCs w:val="22"/>
    </w:rPr>
    <w:t xml:space="preserve">Relational Database, ACID Transactions, pgvector, HNSW Indexing, FIFO Lot Depletion, Row-Level Locking, Burn Rate Prediction, NoSQL JSONB, Trigger Automation.</w:t>
  </w:r>
</w:p>
`;
  frontMatter = frontMatter.replace(absPlaceholder, absPlaceholder + abstractParas);
}

// 2. Parse Markdown Chapters
const mdPath = 'C:/Users/nk953/.gemini/antigravity/scratch/smart-inventory/docs/PES_UNIVERSITY_PROJECT_REPORT.md';
const mdContent = fs.readFileSync(mdPath, 'utf8');

const ch1Idx = mdContent.indexOf('# CHAPTER 1');
const chaptersMd = mdContent.slice(ch1Idx);
const lines = chaptersMd.split(/\r?\n/);

let chaptersXml = '';
let inCodeBlock = false;
let codeBlockLines = [];
let codeLanguage = '';

let inTable = false;
let tableLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Handle Code Blocks
  if (line.trim().startsWith('```')) {
    if (inCodeBlock) {
      // End code block
      chaptersXml += renderCodeBlockXml(codeBlockLines, codeLanguage);
      inCodeBlock = false;
      codeBlockLines = [];
      codeLanguage = '';
    } else {
      // If table was active, flush it
      if (inTable) {
        chaptersXml += renderTableXml(tableLines);
        inTable = false;
        tableLines = [];
      }
      inCodeBlock = true;
      codeLanguage = line.trim().slice(3).trim();
      codeBlockLines = [];
    }
    continue;
  }

  if (inCodeBlock) {
    codeBlockLines.push(line);
    continue;
  }

  // Handle Tables
  if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
    if (!inTable) {
      inTable = true;
      tableLines = [];
    }
    tableLines.push(line.trim());
    continue;
  } else if (inTable) {
    chaptersXml += renderTableXml(tableLines);
    inTable = false;
    tableLines = [];
  }

  const trimmed = line.trim();
  if (trimmed === '' || trimmed === '---' || trimmed === '<br>' || trimmed === '<br><br>') {
    continue;
  }

  // Handle Screenshot Placeholders
  if (trimmed.includes('[Insert Screenshot') || trimmed.includes('Insert Screenshot')) {
    const cleanCaption = trimmed.replace(/\*\*/g, '').replace(/[\[\]]/g, '').trim();
    chaptersXml += renderScreenshotBoxXml(cleanCaption);
    continue;
  }

  // Handle Chapter Headings (# CHAPTER <N> / # <TITLE>)
  if (trimmed.startsWith('# CHAPTER') || trimmed.startsWith('# APPENDIX') || trimmed.startsWith('# CHAPTER 10') || (trimmed.startsWith('# ') && !trimmed.startsWith('### '))) {
    // If followed immediately by another # line (e.g. # CHAPTER 1 \n # INTRODUCTION)
    let titleText = trimmed.replace(/^#\s*/, '');
    if (i + 1 < lines.length && lines[i + 1].trim().startsWith('# ') && !lines[i + 1].trim().startsWith('### ')) {
      titleText += ' — ' + lines[i + 1].trim().replace(/^#\s*/, '');
      i++; // skip next line
    }

    chaptersXml += `
<w:p>
  <w:pPr>
    <w:pStyle w:val="Heading1"/>
    <w:pageBreakBefore/>
    <w:spacing w:before="360" w:after="200"/>
    <w:jc w:val="left"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="32"/><w:szCs w:val="32"/>
      <w:color w:val="002060"/>
    </w:rPr>
    <w:t xml:space="preserve">${escapeXml(titleText)}</w:t>
  </w:r>
</w:p>`;
    continue;
  }

  // Handle Section Headings (### 1.1 Overview or ## 1.1)
  if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
    const headingText = trimmed.replace(/^#+\s*/, '');
    chaptersXml += `
<w:p>
  <w:pPr>
    <w:pStyle w:val="Heading2"/>
    <w:spacing w:before="240" w:after="120"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="26"/><w:szCs w:val="26"/>
      <w:color w:val="1F497D"/>
    </w:rPr>
    <w:t xml:space="preserve">${escapeXml(headingText)}</w:t>
  </w:r>
</w:p>`;
    continue;
  }

  // Handle Subsection Headings (#### 1.1.1)
  if (trimmed.startsWith('#### ')) {
    const headingText = trimmed.replace(/^####\s*/, '');
    chaptersXml += `
<w:p>
  <w:pPr>
    <w:pStyle w:val="Heading3"/>
    <w:spacing w:before="180" w:after="80"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
      <w:color w:val="0F766E"/>
    </w:rPr>
    <w:t xml:space="preserve">${escapeXml(headingText)}</w:t>
  </w:r>
</w:p>`;
    continue;
  }

  // Handle Bullet Lists (- ... or * ...)
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    const bulletText = trimmed.slice(2).trim();
    chaptersXml += `
<w:p>
  <w:pPr>
    <w:spacing w:after="60" w:line="260" w:lineRule="auto"/>
    <w:ind w:left="420" w:hanging="260"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="20"/><w:szCs w:val="20"/>
      <w:color w:val="0F766E"/>
    </w:rPr>
    <w:t xml:space="preserve">▪  </w:t>
  </w:r>
  ${parseInlineRuns(bulletText, 22, '0F172A')}
</w:p>`;
    continue;
  }

  // Handle Numbered Lists (1. ... or 2. ...)
  const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
  if (numMatch) {
    const numPrefix = numMatch[1];
    const numText = numMatch[2];
    chaptersXml += `
<w:p>
  <w:pPr>
    <w:spacing w:after="80" w:line="260" w:lineRule="auto"/>
    <w:ind w:left="420" w:hanging="260"/>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="22"/><w:szCs w:val="22"/>
      <w:color w:val="1F497D"/>
    </w:rPr>
    <w:t xml:space="preserve">${escapeXml(numPrefix)} </w:t>
  </w:r>
  ${parseInlineRuns(numText, 22, '0F172A')}
</w:p>`;
    continue;
  }

  // Standard Paragraph
  chaptersXml += `
<w:p>
  <w:pPr>
    <w:spacing w:after="120" w:line="276" w:lineRule="auto"/>
    <w:jc w:val="both"/>
  </w:pPr>
  ${parseInlineRuns(trimmed, 22, '1E293B')}
</w:p>`;
}

// Flush any pending table or code
if (inTable) chaptersXml += renderTableXml(tableLines);
if (inCodeBlock) chaptersXml += renderCodeBlockXml(codeBlockLines, codeLanguage);

// Assemble final document XML
const fullDocumentXml = frontMatter + chaptersXml + sectPrAndEnd;

// Write updated document.xml
fs.writeFileSync(templateDocXmlPath, fullDocumentXml, 'utf8');
console.log(`Updated ${templateDocXmlPath} successfully! (Total XML length: ${fullDocumentXml.length} chars)`);
