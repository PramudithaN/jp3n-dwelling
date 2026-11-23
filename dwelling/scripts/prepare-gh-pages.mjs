import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '../../docs');
const base = '/jp3n-dwelling';
const exts = new Set(['.html', '.css', '.js', '.json']);

function rewriteContent(content) {
  let out = content;
  // HTML attributes: href="/..." and src="/..."
  out = out.replace(/(href|src)="\/(?!\/|jp3n-dwelling(?:\/|"))/g, `$1="${base}/`);
  out = out.replace(/(href|src)='\/(?!\/|jp3n-dwelling(?:\/|'))/g, `$1='${base}/`);
  // CSS url(/...)
  out = out.replace(/url\((['"]?)\/(?!\/|jp3n-dwelling(?:\/|['"]|\)))/g, `url($1${base}/`);
  // Embedded JSON/JS asset paths like "/images/..." or "/fonts/..."
  out = out.replace(/(["'])\/(images|fonts)\//g, `$1${base}/$2/`);
  return out;
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (exts.has(path.extname(entry.name))) {
      const original = fs.readFileSync(full, 'utf8');
      const updated = rewriteContent(original);
      if (updated !== original) {
        fs.writeFileSync(full, updated, 'utf8');
      }
    }
  }
}

if (fs.existsSync(docsDir)) {
  walk(docsDir);
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf8');
  console.log(`[gh-pages] Rewrote root-relative paths for ${base} and wrote docs/.nojekyll`);
} else {
  console.error(`[gh-pages] Missing output directory: ${docsDir}`);
  process.exit(1);
}
