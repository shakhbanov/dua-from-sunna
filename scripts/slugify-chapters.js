import fs from 'fs';
import path from 'path';

const chaptersDir = path.join(process.cwd(), 'data', 'chapters');
const constantsPath = path.join(process.cwd(), 'constants.ts');

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['`’]/g, '') // remove apostrophes
    .replace(/[^a-z0-9\s-]/g, ' ') // remove non-ascii
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const files = fs.readdirSync(chaptersDir).filter(f => f.startsWith('chapter-') && f.endsWith('.ts'));
let constantsContent = fs.readFileSync(constantsPath, 'utf8');

for (const file of files) {
  const fullPath = path.join(chaptersDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const idMatch = file.match(/chapter-(\d{3})\.ts/);
  if (!idMatch) continue;
  const id = idMatch[1];
  // find English title inside file
  const m = content.match(/title:\s*\{[\s\S]*?en:\s*"([^"]+)"[\s\S]*?\}/m);
  const titleEn = m ? m[1] : null;
  const slug = titleEn ? slugify(titleEn) : `chapter-${id}`;
  const newFilename = `${id}-${slug}.ts`;
  const newFullPath = path.join(chaptersDir, newFilename);
  if (fs.existsSync(newFullPath)) {
    console.log(`Target exists, skipping: ${newFilename}`);
    continue;
  }
  fs.renameSync(fullPath, newFullPath);
  // update constants.ts import path
  const oldImport = `./data/chapters/chapter-${id}`;
  const newImport = `./data/chapters/${id}-${slug}`;
  constantsContent = constantsContent.replace(new RegExp(oldImport.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'),'g'), newImport);
  console.log(`${file} -> ${newFilename}`);
}

fs.writeFileSync(constantsPath, constantsContent, 'utf8');
console.log('constants.ts imports updated.');
