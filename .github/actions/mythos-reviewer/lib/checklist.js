class Checklist {
  getSections() {
    return [
      { category: 'Async & Concurrency', severity: 'CRITICAL', items: ['I reviewed async code for blocking calls, orphaned tasks, and race conditions.'] },
      { category: 'Security', severity: 'CRITICAL', items: ['I reviewed user-controlled input for injection risks and secret exposure.'] },
      { category: 'Resource Cleanup', severity: 'CRITICAL', items: ['I verified opened resources are closed during success, failure, and shutdown paths.'] },
    ];
  }
}
module.exports = Checklist;
