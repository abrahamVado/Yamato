import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tsNode = require("ts-node");
tsNode.register({
  //1.- Transpile on the fly without full type checking so DOM globals resolve cleanly in Node.
  transpileOnly: true,
  compilerOptions: {
    module: "Node16",
    moduleResolution: "node16",
    target: "es2020",
    lib: ["es2020", "dom"],
  },
  skipProject: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modulePath = path.join(__dirname, "..", "src", "lib", "api-client.ts");

test("apiRequest prefixes the configured base URL for relative paths", async () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
  const calls = [];

  //1.- Override the environment so the module picks up a deterministic API base URL.
  process.env.NEXT_PUBLIC_API_BASE_URL = "https://laravel.example/api";
  //2.- Stub fetch to capture the resolved request input without issuing a network call.
  global.fetch = async (input, init = {}) => {
    calls.push({ input, init });
    return {
      ok: true,
      status: 200,
      json: async () => ({ message: "ok" }),
    };
  };

  try {
    //3.- Reload the module so it reads the overridden environment variable before running the assertion.
    delete require.cache[require.resolve(modulePath)];
    const { apiRequest } = require(modulePath);
    await apiRequest("/foo");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].input, "https://laravel.example/api/foo");
  } finally {
    //4.- Clean up the module cache and environment overrides for isolation across tests.
    delete require.cache[require.resolve(modulePath)];
    process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
    global.fetch = originalFetch;
  }
});
