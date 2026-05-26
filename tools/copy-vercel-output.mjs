import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(rootDir, 'Fadi/.vercel/output');
const target = resolve(rootDir, '.vercel/output');

if (!existsSync(source)) {
  throw new Error(`Vercel output not found: ${source}`);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(dirname(target), { recursive: true });
cpSync(source, target, { recursive: true });
