const test = require('node:test');
const assert = require('node:assert/strict');
const Detectors = require('../lib/detectors');
const { isExcluded, parseExcludePatterns } = require('../main');

test('detects direct prompt injection risks', () => {
  const detectors = new Detectors();
  const issues = detectors.detectPromptInjection('src/app.ts', 'const prompt = req.body.message;');
  assert.equal(issues.length, 1);
  assert.equal(issues[0].severity, 'CRITICAL');
});

test('detects hardcoded secrets', () => {
  const detectors = new Detectors();
  const issues = detectors.detectHardcodedSecrets('src/app.ts', 'const apiKey = "sk-test-secret";');
  assert.equal(issues[0].rule, 'hardcoded-secret');
});

test('supports comma separated exclude patterns', () => {
  const patterns = parseExcludePatterns('docs/,*.md');
  assert.equal(isExcluded('docs/readme.txt', patterns), true);
  assert.equal(isExcluded('README.md', patterns), true);
  assert.equal(isExcluded('src/main.ts', patterns), false);
});
