import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Docker documentation lists build and run commands for both images', async () => {
  //1.- Load the Docker documentation so we can inspect the published container workflow.
  const dockerDocPath = path.join(rootDir, 'docs', 'docker', 'README.md');
  const dockerDoc = await readFile(dockerDocPath, 'utf8');

  //2.- Confirm the root-level image instructions include the build and run commands.
  assert.match(dockerDoc, /docker build -t yamato-app \./);
  assert.match(dockerDoc, /docker run --rm -p 3000:3000 yamato-app/);

  //3.- Confirm the web-only image instructions also surface build and run commands.
  assert.match(dockerDoc, /docker build -t yamato-web \./);
  assert.match(dockerDoc, /docker run --rm -p 3000:3000 yamato-web/);
});
