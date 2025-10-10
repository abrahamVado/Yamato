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
  //1.- Load the TypeScript source so the test can transpile it without a build step.
  const sourcePath = path.join(rootDir, 'web', 'src', 'lib', 'auth-diagnostics.ts');
  const sourceCode = await readFile(sourcePath, 'utf8');

  //2.- Transpile the module to CommonJS so Node's VM can execute it in isolation.
  const transpiled = ts.transpileModule(sourceCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });

  //3.- Evaluate the compiled code inside a sandbox to extract the exported helpers.
  const require = createRequire(import.meta.url);
  const module = { exports: {} };
  const sandbox = { module, exports: module.exports, require, process, console, URL, URLSearchParams }; // eslint-disable-line
  vm.runInNewContext(transpiled.outputText, sandbox, { filename: sourcePath });
  return module.exports;
}

test('runAuthDiagnostics aggregates successful authentication probes', async () => {
  const { runAuthDiagnostics } = await importDiagnosticsModule();

  const calls = [];
  const fakeFetch = async (input, init = {}) => {
    calls.push({ input: String(input), method: init.method ?? 'GET' });
    if (init.method === 'HEAD') {
      return new Response('', { status: 200 });
    }
    if (String(input).endsWith('/auth/register')) {
      return new Response(JSON.stringify({ message: 'Registered', data: { id: 1 } }), {
        status: 201,
        headers: { 'set-cookie': 'XSRF-TOKEN=abc; Path=/; HttpOnly' },
      });
    }
    if (String(input).endsWith('/auth/login')) {
      return new Response(JSON.stringify({ token: 'login-token-123' }), {
        status: 200,
        headers: { 'set-cookie': 'laravel_session=def; Path=/; HttpOnly' },
      });
    }
    if (String(input).endsWith('/email/verification-notification')) {
      return new Response(JSON.stringify({ message: 'Verification sent' }), {
        status: 200,
      });
    }
    throw new Error(`Unexpected fetch call to ${input}`);
  };

  const report = await runAuthDiagnostics(
    {
      baseUrl: 'https://api.example.com',
      register: { name: 'Tester', email: 'diagnostic+{{timestamp}}@example.com', password: 'Secret123' },
      login: { email: 'admin@example.com', password: 'secret', remember: true },
      verification: { email: 'admin@example.com' },
      lookupHost: async () => '127.0.0.1',
    },
    fakeFetch,
  );

  //1.- Confirm the backend probe executed and surfaced the host lookup.
  assert.equal(report.backend.reachable, true);
  assert.equal(report.backend.ip, '127.0.0.1');

  //2.- Ensure all authentication stages reported success with meaningful context.
  const statuses = Object.fromEntries(report.results.map((result) => [result.id, result.status]));
  assert.deepEqual(statuses, {
    register: 'success',
    login: 'success',
    token: 'success',
    verification: 'success',
  });
  assert.equal(report.context.loginToken, 'login-token-123');
  assert.ok(report.context.registeredEmail.includes('@example.com'));

  //3.- Verify the fetch sequence hit the expected endpoints.
  const endpoints = calls.map((call) => `${call.method} ${call.input}`);
  assert.deepEqual(endpoints, [
    'HEAD https://api.example.com',
    'POST https://api.example.com/auth/register',
    'POST https://api.example.com/auth/login',
    'POST https://api.example.com/email/verification-notification',
  ]);
});

