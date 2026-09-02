#!/usr/bin/env node
// Generate per-chapter Open Graph / Twitter preview images (1200×630 PNG).
// Runs at build time — no network calls, no runtime cost.
// Output: dist/og/<slug>.png for each chapter × 2 languages + home + prayer-times.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const outDir = path.join(distDir, 'og');
fs.mkdirSync(outDir, { recursive: true });

// --- Load fonts (WOFF is fine for satori) ---

const fontInter400 = fs.readFileSync(
  path.join(root, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-400-normal.woff')
);
const fontInter700 = fs.readFileSync(
  path.join(root, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-700-normal.woff')
);
const fonts = [
  { name: 'Inter', data: fontInter400, weight: 400, style: 'normal' },
  { name: 'Inter', data: fontInter700, weight: 700, style: 'normal' },
];

// --- Load chapters from the SSR bundle (same data the pages render) ---

const ssrBundle = path.join(root, 'dist-server', 'entry-server.js');
if (!fs.existsSync(ssrBundle)) {
  console.error(`✗ ${ssrBundle} not found. Run \`npm run build:ssr\` before \`npm run og\`.`);
  process.exit(1);
}
const { contentCatalog } = await import(url.pathToFileURL(ssrBundle).href);
const collections = contentCatalog();

// --- Image template ---

function chapterImage({ number, titleRu, titleEn, basmala }) {
  return {
    type: 'div',
    props: {
      style: {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        padding: '70px 80px',
        background: 'linear-gradient(135deg, #0a0a0b 0%, #18181b 70%, #27272a 100%)',
        color: '#fafafa',
        fontFamily: 'Inter',
        position: 'relative',
      },
      children: [
        // Decorative geometric badge (top-right) — Arabic text rendering in
        // satori via opentype.js is unreliable with complex shaping, so we
        // use a purely Latin layout.
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 60,
              right: 80,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '6px',
              color: 'rgba(250, 250, 250, 0.4)',
              padding: '10px 22px',
              border: '2px solid rgba(250, 250, 250, 0.25)',
              borderRadius: 8,
            },
            children: 'ДУА · DUA',
          },
        },
        // Header row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              marginBottom: 40,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: '3px',
                    color: '#a1a1aa',
                    textTransform: 'uppercase',
                  },
                  children: number ? `Глава ${number} · Chapter ${number}` : 'Дуа · Dua',
                },
              },
            ],
          },
        },
        // RU title
        {
          type: 'div',
          props: {
            style: {
              fontSize: titleRu.length > 45 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 24,
              maxWidth: 1040,
            },
            children: titleRu,
          },
        },
        // EN title
        {
          type: 'div',
          props: {
            style: {
              fontSize: titleEn.length > 45 ? 30 : 36,
              fontWeight: 400,
              lineHeight: 1.25,
              color: '#d4d4d8',
              maxWidth: 1040,
              marginBottom: 'auto',
            },
            children: titleEn,
          },
        },
        // Footer: domain + badge
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 40,
              borderTop: '1px solid rgba(250, 250, 250, 0.12)',
              paddingTop: 24,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: 28, fontWeight: 700, color: '#fafafa' },
                  children: 'dua.shakhbanov.org',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 22,
                    color: '#a1a1aa',
                    display: 'flex',
                    gap: 10,
                  },
                  children: 'Дуа и азкары из Сунны · Duas and Adhkar from the Sunnah',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderPng(tree, outFile) {
  const svg = await satori(tree, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  fs.writeFileSync(outFile, png);
}

// --- Generate ---

let count = 0;

// Home image (generic)
await renderPng(
  chapterImage({
    number: null,
    titleRu: 'Дуа и азкары из Сунны и Корана',
    titleEn: 'Duas and Adhkar from the Sunnah and the Quran',
  }),
  path.join(outDir, 'home.png')
);
count++;

// Prayer times image
await renderPng(
  chapterImage({
    number: null,
    titleRu: 'Время намаза',
    titleEn: 'Prayer times',
  }),
  path.join(outDir, 'prayer-times.png')
);
count++;

// Collection index images
for (const coll of collections) {
  if (coll.id === 'sunna') continue; // the default collection uses home.png
  await renderPng(
    chapterImage({
      number: null,
      titleRu: coll.title.ru,
      titleEn: coll.title.en,
    }),
    path.join(outDir, `${coll.id}-index.png`)
  );
  count++;
}

// Per-chapter images (one PNG per chapter, rendered as RU-primary; reused by
// the EN page via slug mapping). Quranic chapters are thematic groups rather
// than numbered book chapters, so they carry no number badge.
for (const coll of collections) {
  for (const ch of coll.chapters) {
    const slug = ch.slug;
    await renderPng(
      chapterImage({
        number: coll.id === 'sunna' ? ch.id : null,
        titleRu: ch.title.ru,
        titleEn: ch.title.en,
      }),
      path.join(outDir, `${slug.ru}.png`)
    );
    // EN variant uses the same image (content is bilingual already) — write a
    // second file under the EN slug so og:image URL can use the local page slug.
    if (slug.en !== slug.ru) {
      fs.copyFileSync(path.join(outDir, `${slug.ru}.png`), path.join(outDir, `${slug.en}.png`));
    }
    count++;
  }
}

console.log(`✓ dist/og/ — ${count} OG images (1200×630)`);
