#!/usr/bin/env node
/**
 * Generate site-verification HTML files (Yandex.Webmaster, Google Search Console)
 * at build time from environment variables. Values stay in .env.local and
 * never reach the repository.
 *
 * Reads VITE_YANDEX_WEBMASTER_CODE and VITE_GOOGLE_VERIFICATION_CODE from
 * .env.local (or process.env) and writes:
 *   dist/yandex_<YANDEX_CODE>.html
 *   dist/google<GOOGLE_CODE>.html
 *
 * If a variable is absent, the corresponding file is simply not generated
 * (silent no-op).
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Lightweight .env.local reader — no dotenv dependency needed.
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    const value = rawValue.replace(/^["'](.*)["']$/, '$1');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(root, '.env.local'));

const distDir = path.join(root, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('  generate-verification: dist/ not found, skipping');
  process.exit(0);
}

const yandexCode = process.env.VITE_YANDEX_WEBMASTER_CODE;
if (yandexCode) {
  const name = `yandex_${yandexCode}.html`;
  const body = `<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: ${yandexCode}</body>
</html>
`;
  fs.writeFileSync(path.join(distDir, name), body, 'utf8');
  console.log(`  generated ${name}`);
} else {
  console.log('  VITE_YANDEX_WEBMASTER_CODE not set — skipping Yandex file');
}

const googleCode = process.env.VITE_GOOGLE_VERIFICATION_CODE;
if (googleCode) {
  const name = `google${googleCode}.html`;
  const body = `google-site-verification: ${name}\n`;
  fs.writeFileSync(path.join(distDir, name), body, 'utf8');
  console.log(`  generated ${name}`);
} else {
  console.log('  VITE_GOOGLE_VERIFICATION_CODE not set — skipping Google file');
}
