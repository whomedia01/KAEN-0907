type CommitArticleInput = {
  id: string;
  title: string;
  slug: string;
  status: string;
  article: Record<string, unknown>;
  actorEmail?: string | null;
};

function getGithubConfig() {
  return {
    token: process.env.GITHUB_CONTENT_TOKEN,
    repo: process.env.GITHUB_CONTENT_REPO || 'apark12321-ux/vision-media-mediaoffice',
    branch: process.env.GITHUB_CONTENT_BRANCH || 'main'
  };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  };
}

function encodeBase64Utf8(value: string) {
  return Buffer.from(value, 'utf8').toString('base64');
}

function articleFilePath(slug: string) {
  return `content/articles/${slug}.json`;
}

async function fetchExistingFileSha(params: { repo: string; branch: string; path: string; token: string }) {
  const response = await fetch(`https://api.github.com/repos/${params.repo}/contents/${params.path}?ref=${params.branch}`, {
    method: 'GET',
    headers: githubHeaders(params.token),
    cache: 'no-store'
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub file lookup failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return typeof data.sha === 'string' ? data.sha : null;
}

export async function commitArticleSnapshot(input: CommitArticleInput) {
  const config = getGithubConfig();

  if (!config.token) {
    return {
      skipped: true,
      reason: 'GITHUB_CONTENT_TOKEN is not configured'
    };
  }

  const path = articleFilePath(input.slug);
  const sha = await fetchExistingFileSha({ repo: config.repo, branch: config.branch, path, token: config.token });
  const committedAt = new Date().toISOString();
  const snapshot = {
    schema: 'edujournal.article.snapshot.v1',
    committed_at: committedAt,
    actor_email: input.actorEmail ?? null,
    source: 'admin.article.editor',
    article_id: input.id,
    slug: input.slug,
    status: input.status,
    article: input.article
  };

  const body: Record<string, unknown> = {
    message: `cms: ${input.status} article ${input.slug}`,
    content: encodeBase64Utf8(`${JSON.stringify(snapshot, null, 2)}\n`),
    branch: config.branch,
    committer: {
      name: 'EDU JOURNAL CMS',
      email: 'cms@edujournal.local'
    }
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/${path}`, {
    method: 'PUT',
    headers: githubHeaders(config.token),
    body: JSON.stringify(body),
    cache: 'no-store'
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub commit failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  return {
    skipped: false,
    path,
    commit_sha: data?.commit?.sha ?? null,
    commit_url: data?.commit?.html_url ?? null
  };
}
