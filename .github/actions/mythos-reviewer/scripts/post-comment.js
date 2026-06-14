const fs = require('fs');

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const body = process.env.COMMENT_BODY;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!token || !body || process.env.GITHUB_EVENT_NAME !== 'pull_request') return;

  const event = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
  const response = await fetch(`${event.repository.url}/issues/${event.pull_request.number}/comments`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ body }),
  });
  if (!response.ok) throw new Error(`Failed to post PR comment: ${response.status} ${await response.text()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
