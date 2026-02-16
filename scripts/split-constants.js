import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const SRC = ROOT; // project root (file locations are in root)
const constantsPath = path.join(SRC, 'constants.ts');
const outDir = path.join(SRC, 'data', 'chapters');

if (!fs.existsSync(constantsPath)) {
  console.error('constants.ts not found');
  process.exit(1);
}

const src = fs.readFileSync(constantsPath, 'utf8');

// 1) extract APP_TITLE header (everything before "export const MOCK_DATABASE")
const marker = 'export const MOCK_DATABASE';
const markerIndex = src.indexOf(marker);
if (markerIndex === -1) {
  console.error('MOCK_DATABASE marker not found in constants.ts');
  process.exit(1);
}

const header = src.slice(0, markerIndex);

// 2) locate the array start '[' (skip the type annotation brackets) and the matching closing '];'
const equalsIndex = src.indexOf('=', markerIndex);
if (equalsIndex === -1) {
  console.error('Equals sign after MOCK_DATABASE not found');
  process.exit(1);
}
const arrayStart = src.indexOf('[', equalsIndex);
if (arrayStart === -1) {
  console.error('Opening [ for MOCK_DATABASE array literal not found');
  process.exit(1);
}

let i = arrayStart;
let depth = 0;
let inSingle = false;
let inDouble = false;
let inTemplate = false;
let inLineComment = false;
let inBlockComment = false;
for (; i < src.length; i++) {
  const ch = src[i];
  const prev = src[i - 1];

  // handle comments
  if (!inSingle && !inDouble && !inTemplate) {
    if (!inBlockComment && ch === '/' && src[i + 1] === '/') {
      inLineComment = true;
      i++; // skip next
      continue;
    }
    if (!inLineComment && ch === '/' && src[i + 1] === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
  }
  if (inLineComment) {
    if (ch === '\n') inLineComment = false;
    continue;
  }
  if (inBlockComment) {
    if (ch === '*' && src[i + 1] === '/') {
      inBlockComment = false;
      i++;
    }
    continue;
  }

  // handle strings
  if (!inSingle && !inDouble && !inTemplate) {
    if (ch === "'") { inSingle = true; continue; }
    if (ch === '"') { inDouble = true; continue; }
    if (ch === '`') { inTemplate = true; continue; }
  } else {
    if (inSingle && ch === "'" && prev !== '\\') { inSingle = false; continue; }
    if (inDouble && ch === '"' && prev !== '\\') { inDouble = false; continue; }
    if (inTemplate && ch === '`' && prev !== '\\') { inTemplate = false; continue; }
    continue;
  }

  if (ch === '[') depth++;
  if (ch === ']') {
    depth--;
    if (depth === 0) break; // found matching closing bracket for the array
  }
}

if (i >= src.length) {
  console.error('Failed to find closing ] for MOCK_DATABASE');
  process.exit(1);
}

const arrayEnd = i;
const arrayContent = src.slice(arrayStart + 1, arrayEnd);

// 3) parse top-level objects in arrayContent by counting braces and respecting strings/comments
const items = [];
let pos = 0;
while (pos < arrayContent.length) {
  // skip whitespace and commas
  while (pos < arrayContent.length && /[\s,]/.test(arrayContent[pos])) pos++;
  if (pos >= arrayContent.length) break;
  if (arrayContent[pos] !== '{') {
    console.error('Expected object starting with { at position', pos);
    break;
  }
  let start = pos;
  let braceDepth = 0;
  inSingle = inDouble = inTemplate = false;
  inLineComment = inBlockComment = false;
  for (; pos < arrayContent.length; pos++) {
    const ch = arrayContent[pos];
    const prev = arrayContent[pos - 1];
    // comments
    if (!inSingle && !inDouble && !inTemplate) {
      if (!inBlockComment && ch === '/' && arrayContent[pos + 1] === '/') { inLineComment = true; pos++; continue; }
      if (!inLineComment && ch === '/' && arrayContent[pos + 1] === '*') { inBlockComment = true; pos++; continue; }
    }
    if (inLineComment) { if (ch === '\n') inLineComment = false; continue; }
    if (inBlockComment) { if (ch === '*' && arrayContent[pos + 1] === '/') { inBlockComment = false; pos++; } continue; }

    if (!inSingle && !inDouble && !inTemplate) {
      if (ch === "'") { inSingle = true; continue; }
      if (ch === '"') { inDouble = true; continue; }
      if (ch === '`') { inTemplate = true; continue; }
    } else {
      if (inSingle && ch === "'" && prev !== '\\') { inSingle = false; continue; }
      if (inDouble && ch === '"' && prev !== '\\') { inDouble = false; continue; }
      if (inTemplate && ch === '`' && prev !== '\\') { inTemplate = false; continue; }
      continue;
    }

    if (ch === '{') braceDepth++;
    if (ch === '}') {
      braceDepth--;
      if (braceDepth === 0) { pos++; break; }
    }
  }
  const itemText = arrayContent.slice(start, pos).trim();
  items.push(itemText);
}

if (items.length === 0) {
  console.error('No items found in MOCK_DATABASE array');
  process.exit(1);
}

// 4) create output directory
fs.mkdirSync(outDir, { recursive: true });

// helper to extract id value from itemText
function extractId(itemText) {
  const m = itemText.match(/\bid\s*:\s*(\d+)\b/);
  return m ? Number(m[1]) : null;
}

const importsList = [];
for (const item of items) {
  const id = extractId(item);
  if (!id) {
    console.error('Could not extract id from item; skipping.');
    continue;
  }
  const filename = `chapter-${String(id).padStart(3, '0')}.ts`;
  const varName = `CHAPTER_${String(id).padStart(3, '0')}`;
  const filePath = path.join(outDir, filename);
  const fileContent = `import { ChapterData } from '../../types';\n\nexport const ${varName}: ChapterData = ${item};\n`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  importsList.push({ id, filename, varName });
}

// 5) write a new constants.ts that imports all chapter files and re-exports
let newConstants = "import { ChapterData } from './types';\n\n";
// keep APP_TITLE from header
const appTitleMatch = header.match(/export const APP_TITLE[\s\S]*?;\s*$/m);
if (appTitleMatch) {
  newConstants += appTitleMatch[0] + '\n\n';
} else {
  // fallback: keep the whole header up to marker
  newConstants += header + '\n\n';
}

// add imports
for (const imp of importsList) {
  newConstants += `import { ${imp.varName} } from './data/chapters/${imp.filename.replace(/\.ts$/, '')}';\n`;
}
newConstants += '\nexport const MOCK_DATABASE: ChapterData[] = [\n';
for (const imp of importsList.sort((a,b)=>a.id-b.id)) {
  newConstants += `  ${imp.varName},\n`;
}
newConstants += '];\n';

fs.writeFileSync(constantsPath, newConstants, 'utf8');

console.log(`Split ${items.length} chapter(s) into ${outDir}`);
console.log('Updated constants.ts to re-export assembled MOCK_DATABASE.');
