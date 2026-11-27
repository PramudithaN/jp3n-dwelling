import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '../docs');

if (fs.existsSync(docsDir)) {
  fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf8');
  console.log('[gh-pages] Wrote docs/.nojekyll for custom domain deployment (base: /)');
} else {
  console.error(`[gh-pages] Missing output directory: ${docsDir}`);
  process.exit(1);
}
