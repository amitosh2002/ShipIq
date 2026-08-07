/**
 * Utility functions to generate mock data for the Interview API endpoints.
 */

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate mock application logs
export const generateLogs = (query) => {
  const count = parseInt(query.count, 10) || 50;
  const level = query.level;
  const service = query.service;
  const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
  const services = ['auth-service', 'payment-service', 'user-service', 'notification-service', 'core-api'];

  const logs = [];
  for (let i = 0; i < count; i++) {
    logs.push({
      id: generateId('log'),
      timestamp: new Date(Date.now() - randomInt(0, 1000000000)).toISOString(),
      level: level || randomChoice(levels),
      service: service || randomChoice(services),
      message: `Log event generated for testing purposes - ${randomChoice(['Connection timeout', 'User authenticated', 'Payment processed', 'Cache miss', 'Database query slow'])}`,
      traceId: generateId('trace')
    });
  }
  
  // Sort by timestamp descending
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Generate mock deployments
export const generateDeployments = (query) => {
  const count = parseInt(query.count, 10) || 20;
  const status = query.status;
  const statuses = ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'PENDING'];
  const envs = ['production', 'staging', 'qa', 'development'];
  const services = ['auth-service', 'payment-service', 'user-service', 'notification-service', 'frontend-web'];

  const deployments = [];
  for (let i = 0; i < count; i++) {
    deployments.push({
      id: generateId('dep'),
      service: randomChoice(services),
      environment: randomChoice(envs),
      status: status || randomChoice(statuses),
      version: `v${randomInt(1, 5)}.${randomInt(0, 20)}.${randomInt(0, 10)}`,
      deployedAt: new Date(Date.now() - randomInt(0, 500000000)).toISOString(),
      triggeredBy: `usr_${randomInt(100, 999)}`
    });
  }
  return deployments;
};

// Generate mock notifications
export const generateNotifications = (query) => {
  const count = parseInt(query.count, 10) || 30;
  const type = query.type;
  const types = ['EMAIL', 'SMS', 'PUSH', 'WEBHOOK'];
  const statuses = ['DELIVERED', 'FAILED', 'BOUNCED', 'QUEUED'];

  const notifications = [];
  for (let i = 0; i < count; i++) {
    notifications.push({
      id: generateId('notif'),
      type: type || randomChoice(types),
      status: randomChoice(statuses),
      recipient: `user${randomInt(1, 1000)}@example.com`,
      subject: `Automated Notification ${randomInt(100, 999)}`,
      createdAt: new Date(Date.now() - randomInt(0, 1000000000)).toISOString()
    });
  }
  return notifications;
};

// Generate mock projects
export const generateProjects = (query) => {
  const count = parseInt(query.count, 10) || 15;
  const status = query.status;
  const statuses = ['ACTIVE', 'ARCHIVED', 'PLANNING', 'COMPLETED'];

  const projects = [];
  for (let i = 0; i < count; i++) {
    projects.push({
      id: generateId('proj'),
      name: `Project ${randomChoice(['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega'])} ${randomInt(10, 99)}`,
      status: status || randomChoice(statuses),
      ownerId: `usr_${randomInt(100, 999)}`,
      teamSize: randomInt(1, 20),
      lastActive: new Date(Date.now() - randomInt(0, 2000000000)).toISOString()
    });
  }
  return projects;
};

// --- GITHUB API MOCKS ---

export const generateGithubRepo = (owner, repo) => {
  return {
    id: Math.floor(Math.random() * 10000000),
    node_id: "MDEwOlJlcG9zaXRvcnk=",
    name: repo,
    full_name: `${owner}/${repo}`,
    private: false,
    owner: {
      login: owner,
      id: Math.floor(Math.random() * 1000000),
      avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 10000)}?v=4`,
      type: "Organization"
    },
    html_url: `https://github.com/${owner}/${repo}`,
    description: `An awesome repository for ${repo} built by ${owner}.`,
    fork: false,
    url: `https://api.github.com/repos/${owner}/${repo}`,
    created_at: new Date(Date.now() - Math.random() * 100000000000).toISOString(),
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    size: Math.floor(Math.random() * 50000),
    stargazers_count: Math.floor(Math.random() * 5000),
    watchers_count: Math.floor(Math.random() * 5000),
    language: ["JavaScript", "TypeScript", "Python", "Go", "Rust"][Math.floor(Math.random() * 5)],
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: Math.floor(Math.random() * 1000),
    open_issues_count: Math.floor(Math.random() * 100),
    allow_forking: true,
    is_template: false,
    topics: ["react", "api", "interview", "tools"],
    visibility: "public",
    forks: Math.floor(Math.random() * 1000),
    open_issues: Math.floor(Math.random() * 100),
    watchers: Math.floor(Math.random() * 5000),
    default_branch: "main"
  };
};

export const generateGithubPulls = (owner, repo, count = 10) => {
  const pulls = [];
  const authors = ['amitosh', 'johndoe', 'janedoe', 'alex_dev', 'sarah-codes', 'dependabot[bot]'];
  const titles = [
    'feat: implement new search filters',
    'fix: resolve memory leak in worker',
    'chore: update dependencies',
    'docs: update README with setup instructions',
    'refactor: extract component logic',
    'feat: add draft PR support',
    'bug: button overflow on mobile',
    'test: add unit tests for utils'
  ];

  for (let i = 0; i < count; i++) {
    const isClosed = Math.random() > 0.7;
    const isDraft = Math.random() > 0.8;
    
    pulls.push({
      url: `https://api.github.com/repos/${owner}/${repo}/pulls/${100 + i}`,
      id: Math.floor(Math.random() * 100000000),
      node_id: "MDExOlB1bGxSZXF1ZXN0",
      html_url: `https://github.com/${owner}/${repo}/pull/${100 + i}`,
      diff_url: `https://github.com/${owner}/${repo}/pull/${100 + i}.diff`,
      patch_url: `https://github.com/${owner}/${repo}/pull/${100 + i}.patch`,
      issue_url: `https://api.github.com/repos/${owner}/${repo}/issues/${100 + i}`,
      number: 100 + i,
      state: isClosed ? 'closed' : 'open',
      locked: false,
      title: titles[Math.floor(Math.random() * titles.length)],
      user: {
        login: authors[Math.floor(Math.random() * authors.length)],
        id: Math.floor(Math.random() * 1000000),
        avatar_url: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 10000)}?v=4`,
        type: "User"
      },
      body: "This is a mock pull request description.\n\nFixes #42.",
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updated_at: new Date().toISOString(),
      closed_at: isClosed ? new Date().toISOString() : null,
      merged_at: isClosed && Math.random() > 0.2 ? new Date().toISOString() : null,
      merge_commit_sha: "e5bd3914e2e596debea16f433f57875b5b90bcd6",
      assignee: null,
      assignees: [],
      requested_reviewers: [],
      requested_teams: [],
      labels: [],
      draft: isDraft,
      author_association: "CONTRIBUTOR"
    });
  }
  
  // Sort by created_at descending (newest first, typical GitHub API behavior)
  return pulls.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};
