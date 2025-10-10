import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('README documents the backend health probe', async () => {
  //1.- Load the README so we can examine the developer documentation.
  const readmePath = path.join(rootDir, 'README.md');
  const readme = await readFile(readmePath, 'utf8');

  //2.- Confirm the health-check endpoint and port 8080 are explicitly referenced for the backend.
  assert.match(readme, /http:\/\/localhost:8080\/api\/health/);
});
