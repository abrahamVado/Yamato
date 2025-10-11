import { createRequire } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

//1.- Enable TypeScript support so Node's test runner can import shared helpers.
const require = createRequire(import.meta.url);
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });

const redirectModule = require('../web/src/lib/login-redirect.ts');

test('resolvePostLoginRedirect returns fallback for missing value', () => {
  //2.- Pull the helper exports after ts-node has been registered for CommonJS requires.
  const { resolvePostLoginRedirect, POST_LOGIN_FALLBACK_ROUTE } = redirectModule;
  const result = resolvePostLoginRedirect(null);
  assert.equal(result, POST_LOGIN_FALLBACK_ROUTE);
});

test('resolvePostLoginRedirect enforces private namespace', () => {
  const { resolvePostLoginRedirect, POST_LOGIN_FALLBACK_ROUTE } = redirectModule;
  const result = resolvePostLoginRedirect('/public/home');
  assert.equal(result, POST_LOGIN_FALLBACK_ROUTE);
});

test('resolvePostLoginRedirect preserves valid private destinations', () => {
  const { resolvePostLoginRedirect } = redirectModule;
  const result = resolvePostLoginRedirect('/private/users');
  assert.equal(result, '/private/users');
});

test('resolvePostLoginRedirect rejects protocol-relative urls', () => {
  const { resolvePostLoginRedirect, POST_LOGIN_FALLBACK_ROUTE } = redirectModule;
  const result = resolvePostLoginRedirect('//evil.example.com');
  assert.equal(result, POST_LOGIN_FALLBACK_ROUTE);
});
