import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '../../docs');
const base = '/teqniqks';
const exts = new Set(['.html', '.css', '.js', '.json']);

function rewriteContent(content) {
  let out = content;
  out = out.replace(/(href|src)="\/(?!\/|teqniqks(?:\/|"))/g, `$1="${base}/`);
  out = out.replace(/(href|src)='\/(?!\/|teqniqks(?:\/|'))/g, `$1='${base}/`);
  out = out.replace(/url\((['"]?)\/(?!\/|teqniqks(?:\/|['"]|\)))/g, `url($1${base}/`);
  out = out.replace(/(["'])\/(images|fonts)\//g, `$1${base}/$2/`);
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function writeWithRetry(filePath, data) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      fs.writeFileSync(filePath, data, 'utf8');
      return;
    } catch (err) {
      if (attempt === 4) throw err;
      await sleep(150 * (attempt + 1));
    }
  }
}

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (exts.has(path.extname(entry.name))) {
      const original = fs.readFileSync(full, 'utf8');
      const updated = rewriteContent(original);
      if (updated !== original) {
        await writeWithRetry(full, updated);
      }
    }
  }
}

if (fs.existsSync(docsDir)) {
  await walk(docsDir);
  await writeWithRetry(path.join(docsDir, '.nojekyll'), '');
  console.log(`[gh-pages] Rewrote root-relative paths for ${base} and wrote docs/.nojekyll`);
} else {
  console.error(`[gh-pages] Missing output directory: ${docsDir}`);
  process.exit(1);
}
