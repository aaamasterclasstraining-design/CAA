class Reporter {
  generate(issues, changedFiles) {
    const markdown = [
      '## Mythos Code Reviewer',
      '',
      `Reviewed ${changedFiles.length} changed file(s).`,
      '',
    ];
    if (issues.length === 0) markdown.push('✅ No Mythos review issues found.');
    else {
      markdown.push(`Found ${issues.length} issue(s):`, '');
      for (const issue of issues) markdown.push(`- **${issue.severity}** \`${issue.rule}\` in ${issue.file}:${issue.line} — ${issue.message}${issue.suggestion ? ` _Suggestion:_ ${issue.suggestion}` : ''}`);
    }
    return { markdown: markdown.join('\n'), issues, changedFiles };
  }
}
module.exports = Reporter;
