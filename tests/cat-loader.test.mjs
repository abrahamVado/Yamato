import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import React from 'react';
import * as ReactJsxRuntime from 'react/jsx-runtime';
import { render, waitFor, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const catLoaderPath = path.join(repoRoot, 'web', 'src', 'components', 'CatLoader.tsx');
const requireForComponent = createRequire(catLoaderPath);

//1.- Stand up a shared JSDOM instance so React Testing Library can render the loader in a browser-like environment.
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost/' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.self = dom.window;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

async function loadCatLoaderModule() {
  //1.- Compile the TypeScript/JSX component on the fly so node:test can import it without touching the Next.js toolchain.
  const source = await readFile(catLoaderPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: catLoaderPath,
  });

  const module = { exports: {} };
  const sandbox = {
    module,
    exports: module.exports,
    require: (id) => {
      //2.- Hand-wire module resolution so the transpiled CommonJS code can pull in React and runtime helpers.
      if (id === 'react') return React;
      if (id === 'react/jsx-runtime') return ReactJsxRuntime;
      if (id === 'react/jsx-dev-runtime') return ReactJsxRuntime;
      return requireForComponent(id);
    },
    __filename: catLoaderPath,
    __dirname: path.dirname(catLoaderPath),
    console,
    process,
    setTimeout,
    clearTimeout,
  };

  //3.- Mirror the jsdom-powered globals so effects inside the sandboxed module can observe browser primitives.
  sandbox.window = globalThis.window;
  sandbox.document = globalThis.document;
  sandbox.navigator = globalThis.navigator;

  vm.runInNewContext(transpiled.outputText, sandbox, { filename: catLoaderPath });
  return sandbox.module.exports;
}

test('CatLoader renders the animated cat pieces and injects styles', async (t) => {
  const { default: CatLoader } = await loadCatLoaderModule();

  //1.- Ensure the component export exists so the overlay can render it without runtime failures.
  assert.equal(typeof CatLoader, 'function', 'CatLoader default export should be a function');

  const { container } = render(React.createElement(CatLoader, { label: 'Purring…', size: 180, mirror: false }));
  t.after(() => {
    cleanup();
  });

  //2.- Ensure the loader draws all four segments (two bodies, a tail, and a head).
  const parts = container.querySelectorAll('.cat-loader__part');
  assert.equal(parts.length, 4, 'cat loader should render four animated parts');

  //3.- The size prop should set the CSS custom property so the loader scales predictably.
  const shell = container.querySelector('.cat-loader__shell');
  assert.ok(shell, 'cat loader shell should exist');
  assert.equal(shell?.getAttribute('style'), '--cat-loader-size: 180px;', 'size prop should map to CSS variable');

  //4.- The label should be surfaced for screen readers and visual feedback.
  const labels = Array.from(container.querySelectorAll('p')).filter((node) => node.textContent === 'Purring…');
  assert.equal(labels.length, 1, 'cat loader should render the label once');

  //5.- Wait for the useEffect hook to register the stylesheet in the document head.
  await waitFor(() => {
    const styleEl = document.getElementById('yamato-cat-loader-styles');
    assert.ok(styleEl, 'cat loader styles should be injected into the document head');
    assert.match(styleEl.textContent || '', /cat-loader__frame/);
  });
});

test('CatLoader surfaces polite live updates when rendered without a window object', async () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  try {
    //1.- Remove browser globals to emulate an SSR render where assistive technology needs aria-live for announcements.
    delete globalThis.window;
    delete globalThis.document;

    const { default: CatLoader } = await loadCatLoaderModule();

    //2.- Render the loader to HTML and confirm the busy status includes polite live updates for screen readers.
    const markup = renderToStaticMarkup(React.createElement(CatLoader, { label: 'Loading…' }));
    assert.match(markup, /aria-live="polite"/, 'server-rendered loader should expose aria-live="polite"');
    assert.match(markup, /role="status"/, 'server-rendered loader should keep the status role');
  } finally {
    //3.- Restore the simulated browser environment so subsequent DOM-based tests continue to operate normally.
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
  }
});
