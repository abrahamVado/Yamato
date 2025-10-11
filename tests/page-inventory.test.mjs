import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

async function collectPageRoutes(baseDir, basePrefix) {
  //1.- Return early when a route namespace (like `/public`) has not been implemented yet.
  try {
    await readdir(baseDir);
  } catch (error) {
    if ((error?.code || error?.name) === 'ENOENT') {
      return [];
    }
    throw error;
  }

  const results = [];

  //2.- Walk the directory tree so every nested `page.tsx` contributes a route entry.
  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    const pageFile = entries.find((entry) => entry.isFile() && entry.name === 'page.tsx');
    if (pageFile) {
      const relative = path.relative(baseDir, currentDir);
      const segments = relative ? relative.split(path.sep).filter(Boolean) : [];
      const route = buildRoute(basePrefix, segments);
      results.push(route);
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(path.join(currentDir, entry.name));
      }
    }
  }

  await walk(baseDir);
  return results;
}

function buildRoute(basePrefix, segments) {
  //1.- Support root-level routes like `/` by returning the prefix when no extra segments exist.
  if (segments.length === 0) {
    return basePrefix === '' ? '/' : basePrefix;
  }

  //2.- Append nested segments to the configured prefix so `/docs/...` and `/private/...` resolve correctly.
  const suffix = segments.join('/');
  if (basePrefix === '') {
    return `/${suffix}`;
  }
  return `${basePrefix}/${suffix}`;
}

function extractDocumentedPaths(docContents, sectionHeading) {
  //1.- Isolate the requested section so we only parse the relevant bullet list.
  const sectionRegex = new RegExp(`## ${sectionHeading}[\\s\\S]*?(?=\n## |$)`);
  const sectionMatch = docContents.match(sectionRegex);
  assert.ok(sectionMatch, `Missing section "${sectionHeading}" in page inventory docs`);
  const sectionText = sectionMatch[0];

  //2.- Capture every bullet line that documents a page path (rendered inside backticks).
  const bulletRegex = /-\s+`([^`]+)`/g;
  const paths = [];
  let match;
  while ((match = bulletRegex.exec(sectionText)) !== null) {
    paths.push(match[1]);
  }

  //3.- Ensure the section actually listed at least one route.
  assert.ok(paths.length > 0, `Section "${sectionHeading}" must list at least one page`);
  return paths;
}

function sortUnique(values) {
  //1.- Deduplicate the array and produce a stable order for comparisons.
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

test('Page inventory documentation stays in sync with Next.js routes', async () => {
  //1.- Collect every public and private route by scanning the app directory for `page.tsx` files.
  const publicRoutes = await collectPageRoutes(path.join(repoRoot, 'web', 'src', 'app', '(public)'), '');
  const publicAliasRoutes = await collectPageRoutes(path.join(repoRoot, 'web', 'src', 'app', 'public'), '/public');
  const privateRoutes = await collectPageRoutes(path.join(repoRoot, 'web', 'src', 'app', 'private'), '/private');

  //2.- Load the documentation so we can read the declared route catalog.
  const docPath = path.join(repoRoot, 'docs', 'page-inventory', 'README.md');
  const docContents = await readFile(docPath, 'utf8');
  const documentedPublic = extractDocumentedPaths(docContents, 'Public pages');
  const documentedPrivate = extractDocumentedPaths(docContents, 'Private pages');

  //3.- Compare the live filesystem routes against the documentation to guarantee parity.
  assert.deepStrictEqual(sortUnique([...publicRoutes, ...publicAliasRoutes]), sortUnique(documentedPublic));
  assert.deepStrictEqual(sortUnique(privateRoutes), sortUnique(documentedPrivate));
});
