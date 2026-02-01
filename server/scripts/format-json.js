#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

async function formatDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await formatDir(full);
      continue;
    }
    if (e.isFile() && e.name.endsWith('.json')) {
      try {
        const txt = await fs.readFile(full, 'utf8');
        const obj = JSON.parse(txt);
        await fs.writeFile(full, JSON.stringify(obj, null, 2) + '\n', 'utf8');
        console.log('Formatted', full);
      } catch (err) {
        console.error('Failed to format', full + ':', err.message);
      }
    }
  }
}

// Resolve script directory and default to server/data when no arg provided
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDir = path.join(__dirname, '..', 'data');
const target = process.argv[2] || defaultDataDir;

formatDir(target).catch(err => {
  console.error(err);
  process.exit(1);
});
