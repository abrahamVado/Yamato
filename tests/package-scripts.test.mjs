import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('root package.json exposes project scripts', async () => {
  //1.- Read the root package.json file so we can inspect the configured scripts.
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));

  //2.- Confirm the expected scripts exist and delegate to the Next.js application inside web/.
  assert.equal(packageJson.scripts.dev, 'npm --prefix web run dev');
  assert.equal(packageJson.scripts.build, 'npm --prefix web run build');
  assert.equal(packageJson.scripts.start, 'npm --prefix web run start');
  assert.equal(packageJson.scripts.lint, 'npm --prefix web run lint');
  assert.equal(packageJson.scripts['test:e2e'], 'npm --prefix web run test:e2e');

  //3.- Ensure the root project runs its automated checks with the Node.js test runner.
  assert.equal(packageJson.scripts.test, 'node --test');
});
