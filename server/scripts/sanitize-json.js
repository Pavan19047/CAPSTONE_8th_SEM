#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

async function sanitize(filePath) {
  const txt = await fs.readFile(filePath, 'utf8');
  try {
    JSON.parse(txt);
    console.log('Already valid JSON:', filePath);
    return;
  } catch (err) {
    console.warn('Invalid JSON, attempting sanitize:', filePath);
  }

  // Remove control characters, zero-width, BOM, and common combining marks
  const cleaned = txt.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\uFEFF\u0300-\u036F]/g, '');

  try {
    const obj = JSON.parse(cleaned);
    await fs.writeFile(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
    console.log('Sanitized and wrote:', filePath);
  } catch (err) {
    console.error('Sanitizing failed for', filePath + ':', err.message);
    process.exit(1);
  }
}

const target = process.argv[2] || path.join(process.cwd(), 'data', 'classifier.json');
sanitize(target).catch(err => { console.error(err); process.exit(1); });
