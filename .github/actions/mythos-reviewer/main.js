const fs = require('fs');
const path = require('path');

const Detectors = require('./lib/detectors');
const Reporter = require('./lib/reporters');
const Checklist = require('./lib/checklist');

function info(message) { console.log(message); }
function warning(message) { console.warn(message); }
function fail(message) { console.error(message); process.exitCode = 1; }

function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  const output = typeof value === 'string' ? value : String(value);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<MYTHOS_EOF\n${output}\nMYTHOS_EOF\n`);
}

function parseExcludePatterns(value) {
  return value.split(',').map((pattern) => pattern.trim()).filter(Boolean);
}

function isExcluded(filename, patterns) {
  return patterns.some((pattern) => {
    if (pattern.endsWith('/')) return filename.startsWith(pattern);
    if (pattern.startsWith('*.')) return filename.endsWith(pattern.slice(1));
    return filename.includes(pattern);
  });
}

async function githubRequest(url, token) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok) throw new Error(`GitHub API request failed: ${response.status} ${await response.text()}`);
  return response.json();
}

async function main() {
  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  const token = process.env.GITHUB_TOKEN;
  const criticalFail = process.env.CRITICAL_FAIL === 'true';
  const injectionPatternsFile = process.env.INJECTION_PATTERNS || '.github/actions/mythos-reviewer/lib/injection_patterns.json';
  const excludePaths = parseExcludePatterns(process.env.EXCLUDE_PATHS || '');

  if (eventName !== 'pull_request') {
    info('⏭️ Not a PR event; skipping review');
    setOutput('passed', true);
    setOutput('critical_count', 0);
    setOutput('high_count', 0);
    setOutput('comment_body', 'Mythos Code Reviewer skipped because this is not a pull request event.');
    return;
  }

  const event = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
  const pr = event.pull_request;
  const repo = event.repository;
  info(`🔍 Reviewing PR #${pr.number}: ${pr.title}`);

  const filesUrl = `${repo.url}/pulls/${pr.number}/files?per_page=100`;
  const files = await githubRequest(filesUrl, token);
  const changedFiles = files.map((file) => file.filename).filter((filename) => !isExcluded(filename, excludePaths));
  info(`📂 Changed files (${changedFiles.length}): ${changedFiles.join(', ') || 'none'}`);

  const patternsPath = path.resolve(process.cwd(), injectionPatternsFile);
  const injectionPatterns = JSON.parse(fs.readFileSync(patternsPath, 'utf-8'));
  const issues = analyzeFiles(changedFiles, new Detectors({ injectionPatterns }));
  issues.push(...validateChecklist(pr.body || '', new Checklist()));

  const report = new Reporter().generate(issues, changedFiles);
  const critical = issues.filter((issue) => issue.severity === 'CRITICAL');
  const high = issues.filter((issue) => issue.severity === 'HIGH');
  const passed = critical.length === 0 && high.length === 0;

  info(`📊 Summary: CRITICAL=${critical.length}, HIGH=${high.length}, TOTAL=${issues.length}`);
  setOutput('passed', passed);
  setOutput('critical_count', critical.length);
  setOutput('high_count', high.length);
  setOutput('comment_body', report.markdown);
  fs.writeFileSync(path.join(process.cwd(), '.github/actions/mythos-reviewer/report.json'), JSON.stringify(report, null, 2));

  if (critical.length > 0 && criticalFail) fail(`❌ CRITICAL issues found: ${critical.length}`);
  else if (high.length > 0) warning(`⚠️ HIGH-severity issues found: ${high.length}`);
  else info('✅ Review passed!');
}

function analyzeFiles(files, detectors) {
  const issues = [];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    const ext = path.extname(file);
    if (['.py', '.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      issues.push(...detectors.detectPromptInjection(file, content));
      issues.push(...detectors.detectHardcodedSecrets(file, content));
      issues.push(...detectors.detectResourceLeaks(file, content));
    }
    if (ext === '.py') {
      issues.push(...detectors.detectBlockingCalls(file, content));
      issues.push(...detectors.detectMissingAsyncAwait(file, content));
      issues.push(...detectors.detectRaceConditions(file, content));
      issues.push(...detectors.detectBareExcept(file, content));
      issues.push(...detectors.detectMissingTypeHints(file, content));
    }
  }
  return issues;
}

function validateChecklist(prDescription, checklist) {
  const issues = [];
  for (const section of checklist.getSections()) {
    for (const checkbox of section.items) {
      if (section.severity === 'CRITICAL' && !prDescription.includes(`- [x] ${checkbox}`)) {
        issues.push({ file: 'PR Description', line: 0, severity: 'CRITICAL', rule: 'checklist-incomplete', message: `Missing checklist item: "${checkbox}"`, category: section.category });
      }
    }
  }
  return issues;
}

if (require.main === module) main().catch((error) => fail(`Error: ${error.message}`));
module.exports = { analyzeFiles, isExcluded, parseExcludePatterns, validateChecklist };
