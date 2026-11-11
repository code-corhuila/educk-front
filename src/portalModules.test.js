import test from 'node:test';
import assert from 'node:assert/strict';
import { getPortalModule, PORTAL_MODULES } from './portalModules.js';

test('registers every official satellite portal', () => {
  assert.deepEqual(PORTAL_MODULES.map(({ port }) => port), [3001, 3002, 3003, 3005]);
});

test('selects a portal by its stable identifier', () => {
  assert.equal(getPortalModule('attendance').url, 'http://localhost:3003');
});

test('falls back to identity for an unknown portal identifier', () => {
  assert.equal(getPortalModule('missing').id, 'identity');
});

test('keeps one unique URL per registered portal', () => {
  const urls = PORTAL_MODULES.map(({ url }) => url);
  assert.equal(new Set(urls).size, PORTAL_MODULES.length);
});
