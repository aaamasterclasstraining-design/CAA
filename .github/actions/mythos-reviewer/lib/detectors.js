class Detectors {
  constructor({ injectionPatterns = [] } = {}) {
    this.injectionPatterns = injectionPatterns;
  }

  collect(file, content, patterns, severity, rule, category, suggestion) {
    const issues = [];
    content.split('\n').forEach((line, idx) => {
      if (patterns.some((pattern) => pattern.test(line))) {
        issues.push({ file, line: idx + 1, severity, rule, category, suggestion, message: `${severity === 'CRITICAL' ? '🔴' : '🟠'} ${rule}: ${line.trim()}` });
      }
    });
    return issues;
  }

  detectBlockingCalls(file, content) {
    return this.collect(file, content, [/time\.sleep\(/, /requests\./, /urllib\.request/, /socket\.socket/], 'CRITICAL', 'blocking-call-in-async', 'Async & Concurrency', 'Use asyncio-native APIs such as asyncio.sleep or httpx.AsyncClient.');
  }

  detectMissingAsyncAwait(file, content) {
    return this.collect(file, content, [/asyncio\.create_task\([^)]*\)\s*$/], 'HIGH', 'untracked-async-task', 'Async & Concurrency', 'Store task handles and cancel or await them during shutdown.');
  }

  detectPromptInjection(file, content) {
    const configured = this.injectionPatterns.map((pattern) => new RegExp(pattern.pattern, pattern.flags || 'i'));
    return this.collect(file, content, [/prompt\s*=.*(userInput|user_input|req\.body|request\.json)/i, /ignore\s+(all\s+)?previous\s+instructions/i, ...configured], 'CRITICAL', 'prompt-injection-risk', 'Prompt Injection Security', 'Keep user content in structured fields and validate with an allowlist.');
  }

  detectHardcodedSecrets(file, content) {
    return this.collect(file, content, [/api[_-]?key\s*[:=]\s*['"](?:sk-|pk_|AIza)[^'"]+['"]/i, /token\s*[:=]\s*['"](?:ghp_|gho_)[^'"]+['"]/i, /private[_-]?key\s*[:=]\s*['"]-----BEGIN/i, /password\s*[:=]\s*['"](?:password|12345|admin)['"]/i], 'CRITICAL', 'hardcoded-secret', 'Authentication & Authorization', 'Use environment variables or a managed secret store.');
  }

  detectResourceLeaks(file, content) {
    return this.collect(file, content, [/\.load_model\(/, /torch\.load\(/, /new\s+PrismaClient\(/], 'HIGH', 'resource-cleanup-review', 'Resource Cleanup', 'Wrap resources in lifecycle hooks, context managers, or explicit cleanup.');
  }

  detectRaceConditions(file, content) {
    return this.collect(file, content, [/global\s+\w+/, /threading\.Thread\(/, /multiprocessing\.Process\(/], 'HIGH', 'race-condition-risk', 'Async & Concurrency', 'Protect shared state with locks or isolate mutable state.');
  }

  detectBareExcept(file, content) {
    return this.collect(file, content, [/^\s*except\s*:/], 'HIGH', 'bare-except', 'Reliability', 'Catch specific exception classes and preserve context.');
  }

  detectMissingTypeHints(file, content) {
    return this.collect(file, content, [/^\s*def\s+\w+\([^)]*\)\s*:/], 'MEDIUM', 'missing-type-hints', 'Maintainability', 'Add parameter and return type annotations.');
  }
}

module.exports = Detectors;
