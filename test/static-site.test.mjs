import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('static site is a Persian RTL HTML document', () => {
  assert.match(html, /<html lang="fa" dir="rtl">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<title>BOTRIZ \| فراتر از یک وب‌سایت<\/title>/);
});

test('all in-page navigation targets exist', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const links = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  for (const target of links) assert.ok(ids.has(target), `Missing in-page target: ${target}`);
});

test('static site does not require a backend runtime', () => {
  assert.doesNotMatch(html, /fetch\s*\(|WebSocket\s*\(/);
});
