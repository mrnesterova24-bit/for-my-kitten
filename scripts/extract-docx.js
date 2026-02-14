const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const files = fs.readdirSync(projectRoot);
const docx = files.find(f => f.toLowerCase().endsWith('.docx'));

if (!docx) {
  console.error('No .docx file found in project root');
  process.exit(1);
}

const mammoth = require('mammoth');
const inputPath = path.join(projectRoot, docx);
const outputPath = path.join(projectRoot, 'content-extracted.txt');

mammoth.extractRawText({ path: inputPath })
  .then(result => {
    fs.writeFileSync(outputPath, result.value, 'utf8');
    console.log('Extracted to content-extracted.txt');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
