import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import { createRequire } from 'node:module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

async function importApiClientModule({ windowOrigin, fetchOverrides } = {}) {
  //1.- Transpile the client helper so the test can exercise it without running the Next build.
  const sourcePath = path.join(rootDir, 'web', 'src', 'lib', 'api-client.ts')
  const sourceCode = await readFile(sourcePath, 'utf8')
  const transpiled = ts.transpileModule(sourceCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  })

  const require = createRequire(import.meta.url)
  const module = { exports: {} }
  const fetchCalls = []

  const fetchStub = async (input, init = {}) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url
    fetchCalls.push({ input: url, init })
    if (fetchOverrides) {
      return fetchOverrides({ input: url, init })
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }

  const sandbox = {
    module,
    exports: module.exports,
    require,
    process,
    console,
    URL,
    Request,
    Response,
    Headers,
    fetch: fetchStub,
  }

  if (windowOrigin) {
    //2.- Mock the browser runtime so the client helper detects the cross-origin scenario.
    const storage = new Map()
    sandbox.window = {
      location: { origin: windowOrigin },
      localStorage: {
        getItem: (key) => (storage.has(key) ? storage.get(key) : null),
        setItem: (key, value) => {
          storage.set(key, value)
        },
        removeItem: (key) => {
          storage.delete(key)
        },
      },
    }
  }

  sandbox.globalThis = sandbox

  vm.runInNewContext(transpiled.outputText, sandbox, { filename: sourcePath })
  return { ...sandbox.module.exports, fetchCalls }
}

test('apiRequest proxies browser mutations to the Next.js backend', async () => {
  const previous = process.env.NEXT_PUBLIC_API_BASE_URL
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080/api'
  try {
    const { apiRequest, fetchCalls } = await importApiClientModule({ windowOrigin: 'http://localhost:3000' })
    await apiRequest('auth/register', { method: 'POST', body: JSON.stringify({}) })
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].input, '/api/proxy/auth/register')
    assert.equal(fetchCalls[0].init.credentials, 'include')
  } finally {
    process.env.NEXT_PUBLIC_API_BASE_URL = previous
  }
})

test('apiRequest keeps the direct backend URL on the server', async () => {
  const previous = process.env.NEXT_PUBLIC_API_BASE_URL
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080/api'
  try {
    const { apiRequest, fetchCalls } = await importApiClientModule({ windowOrigin: null })
    await apiRequest('auth/register', { method: 'POST', body: JSON.stringify({}) })
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].input, 'http://localhost:8080/api/auth/register')
  } finally {
    process.env.NEXT_PUBLIC_API_BASE_URL = previous
  }
})

test('apiRequest retries through the proxy when the direct call fails in the browser', async () => {
  const previous = process.env.NEXT_PUBLIC_API_BASE_URL
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:8080/api'
  try {
    let attempts = 0
    const { apiRequest, fetchCalls } = await importApiClientModule({
      windowOrigin: 'http://localhost:8080',
      fetchOverrides: async ({ input }) => {
        attempts += 1
        if (attempts === 1) {
          //1.- Simulate a network failure on the direct backend request to mimic a CORS rejection.
          throw new TypeError('Network failure')
        }
        //2.- Resolve the fallback proxy request with a successful JSON payload.
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      },
    })
    const result = await apiRequest('auth/login', { method: 'POST', body: JSON.stringify({}) })
    //3.- Confirm the helper first attempted the backend URL before retrying through the proxy path.
    assert.equal(fetchCalls.length, 2)
    assert.equal(fetchCalls[0].input, '/api/auth/login')
    assert.equal(fetchCalls[1].input, '/api/proxy/auth/login')
    assert.equal(result?.ok, true)
  } finally {
    process.env.NEXT_PUBLIC_API_BASE_URL = previous
  }
})

test('apiRequest collapses same-origin URLs to relative paths in the browser', async () => {
  const previous = process.env.NEXT_PUBLIC_API_BASE_URL
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000/api'
  try {
    //1.- Recreate a browser runtime whose origin matches the configured API base URL.
    const { apiRequest, fetchCalls } = await importApiClientModule({ windowOrigin: 'http://localhost:3000' })
    //2.- Issue a mutation so the helper resolves the target URL using the shared base.
    await apiRequest('auth/register', { method: 'POST', body: JSON.stringify({}) })
    //3.- Confirm the resolved input removes the origin so fetch("/api/...") is used.
    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].input, '/api/auth/register')
  } finally {
    process.env.NEXT_PUBLIC_API_BASE_URL = previous
  }
})
