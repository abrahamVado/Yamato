import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function importDiagnosticsModule() {
  //1.- Load the auth diagnostics source for on-the-fly TypeScript transpilation.
  const sourcePath = path.join(rootDir, 'web', 'src', 'lib', 'auth-diagnostics.ts');
  const sourceCode = await readFile(sourcePath, 'utf8');

  //2.- Compile the module to CommonJS so the sandboxed VM can execute it.
  const transpiled = ts.transpileModule(sourceCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });

  //3.- Evaluate the bundled code inside a VM context to access the exports.
  const require = createRequire(import.meta.url);
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, require, process, console, URL, URLSearchParams };
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: sourcePath });
  return module.exports;
}

test('applyEmailTemplate injects timestamps and preserves untouched addresses', async () => {
  //1.- Load the helper so the test uses the same logic as the production diagnostics.
  const { applyEmailTemplate } = await importDiagnosticsModule();

  //2.- Replace the token with a deterministic timestamp for reproducible assertions.
  const timestamp = 1_723_456_789_000;
  const templated = applyEmailTemplate('diagnostic+{{timestamp}}@example.com', timestamp);
  assert.equal(templated, 'diagnostic+1723456789000@example.com');

  //3.- Confirm addresses without the token remain unchanged to avoid accidental rewrites.
  const unchanged = applyEmailTemplate('admin@example.com', timestamp);
  assert.equal(unchanged, 'admin@example.com');
});
