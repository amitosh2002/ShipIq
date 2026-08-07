import {
  generateLogs,
  generateDeployments,
  generateNotifications,
  generateProjects,
  generateGithubRepo,
  generateGithubPulls
} from '../utils/mockGenerator.js';

// Chaos Middleware: 37% overall chance to encounter edge cases (Hangs, Errors, Empty States, Malformed Data)
export const chaosMiddleware = (req, res, next) => {
  // Don't fail the metadata endpoint so they always know what to hit
  if (req.path === '/metadata') return next();

  const rand = Math.random();

  // 10% chance to hang for 20 seconds (tests Frontend timeout or manual cancellation)
  if (rand < 0.10) {
    return setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: true, message: 'Gateway Timeout: Upstream took too long to respond' });
      }
    }, 20000);
  }

  // 20% chance to fail randomly immediately (10% to 30% range)
  if (rand < 0.30) {
    const errorStatuses = [
      { code: 500, message: 'Internal Server Error: Database connection timeout' },
      { code: 500, message: 'Internal Server Error: Unexpected token in JSON at position 0' },
      { code: 502, message: 'Bad Gateway: Upstream service failed to respond' },
      { code: 503, message: 'Service Unavailable: Rate limit exceeded for tenant' },
      { code: 503, message: 'Service Unavailable: Node cluster is restarting' },
      { code: 504, message: 'Gateway Timeout: Connection dropped during payload transfer' },
      { code: 401, message: 'Unauthorized: Expired or invalid authentication token' },
      { code: 403, message: 'Forbidden: Insufficient IAM permissions for this resource' },
      { code: 429, message: 'Too Many Requests: Burst limit exceeded, retry after 30s' }
    ];
    const randomError = errorStatuses[Math.floor(Math.random() * errorStatuses.length)];
    
    return res.status(randomError.code).json({
      error: true,
      message: randomError.message,
      code: randomError.code
    });
  }

  // 5% chance to return a completely Empty State (200 OK, but no data)
  if (rand < 0.35) {
    return res.status(200).json({ 
      data: [], 
      count: 0,
      _note: 'Intentionally returned empty to test UI Empty States' 
    });
  }

  // 2% chance to return Malformed JSON (tests if their response.json() parser crashes)
  if (rand < 0.37) {
    res.setHeader('Content-Type', 'application/json');
    // Notice the invalid trailing comma and missing closing brace
    return res.status(200).send('{ "data": [ { "id": "broken", "status": "active", } ], "count": 1'); 
  }

  // 63% chance to succeed normally
  next();
};

export const getMetadata = (req, res) => {
  res.json({
    endpoints: [
      {
        name: 'Application Logs',
        path: '/logs',
        method: 'GET',
        queryParams: [
          { name: 'count', type: 'number', required: false, description: 'Number of logs to generate' },
          { name: 'level', type: 'select', options: ['INFO', 'WARN', 'ERROR', 'DEBUG'], required: false },
          { name: 'service', type: 'string', required: false }
        ]
      },
      {
        name: 'Deployment Records',
        path: '/deployments',
        method: 'GET',
        queryParams: [
          { name: 'count', type: 'number', required: false },
          { name: 'status', type: 'select', options: ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'PENDING'], required: false }
        ]
      },
      {
        name: 'Notification Events',
        path: '/notifications',
        method: 'GET',
        queryParams: [
          { name: 'count', type: 'number', required: false },
          { name: 'type', type: 'select', options: ['EMAIL', 'SMS', 'PUSH', 'WEBHOOK'], required: false }
        ]
      },
      {
        name: 'Project Activities',
        path: '/projects',
        method: 'GET',
        queryParams: [
          { name: 'count', type: 'number', required: false },
          { name: 'status', type: 'select', options: ['ACTIVE', 'ARCHIVED', 'PLANNING', 'COMPLETED'], required: false }
        ]
      },
      {
        name: 'Advanced Search',
        path: '/search',
        method: 'POST',
        bodyParams: [
          { name: 'resource', type: 'select', options: ['logs', 'deployments', 'notifications', 'projects'], required: true },
          { name: 'count', type: 'number', required: false },
          { name: 'filter', type: 'string', required: false }
        ]
      },
      {
        name: 'Update Project',
        path: '/projects/:id',
        method: 'PUT',
        bodyParams: [
          { name: 'status', type: 'select', options: ['ACTIVE', 'ARCHIVED', 'PLANNING', 'COMPLETED'], required: true },
          { name: 'teamSize', type: 'number', required: false }
        ]
      },
      {
        name: 'Delete Log',
        path: '/logs/:id',
        method: 'DELETE'
      }
    ]
  });
};

export const getLogs = (req, res) => {
  if (req.query.count && isNaN(parseInt(req.query.count, 10))) {
    return res.status(400).json({ error: true, message: 'Validation Error: count must be a number' });
  }
  const data = generateLogs(req.query);
  res.json({ data, count: data.length });
};

export const getDeployments = (req, res) => {
  if (req.query.count && isNaN(parseInt(req.query.count, 10))) {
    return res.status(400).json({ error: true, message: 'Validation Error: count must be a number' });
  }
  const data = generateDeployments(req.query);
  res.json({ data, count: data.length });
};

export const getNotifications = (req, res) => {
  if (req.query.count && isNaN(parseInt(req.query.count, 10))) {
    return res.status(400).json({ error: true, message: 'Validation Error: count must be a number' });
  }
  const data = generateNotifications(req.query);
  res.json({ data, count: data.length });
};

export const getProjects = (req, res) => {
  if (req.query.count && isNaN(parseInt(req.query.count, 10))) {
    return res.status(400).json({ error: true, message: 'Validation Error: count must be a number' });
  }
  const data = generateProjects(req.query);
  res.json({ data, count: data.length });
};

export const advancedSearch = (req, res) => {
  const params = { ...req.query, ...req.body };
  const resource = params.resource;
  
  if (!resource) {
    return res.status(400).json({ error: true, message: 'Validation Error: missing required field "resource"' });
  }
  
  if (params.count && isNaN(parseInt(params.count, 10))) {
    return res.status(400).json({ error: true, message: 'Validation Error: count must be a number' });
  }

  let data = [];
  if (resource === 'logs') data = generateLogs(params);
  else if (resource === 'deployments') data = generateDeployments(params);
  else if (resource === 'notifications') data = generateNotifications(params);
  else if (resource === 'projects') data = generateProjects(params);
  else return res.status(400).json({ error: true, message: `Validation Error: Invalid resource type '${resource}'` });
  
  res.json({ data, count: data.length });
};

export const updateProject = (req, res) => {
  const { id } = req.params;
  const { status, teamSize } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: true, message: 'Validation Error: missing required field "status" in body' });
  }

  res.json({
    message: `Project ${id} updated successfully`,
    project: {
      id,
      status,
      teamSize: teamSize || Math.floor(Math.random() * 20) + 1,
      updatedAt: new Date().toISOString()
    }
  });
};

export const deleteLog = (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ error: true, message: 'Validation Error: missing log ID' });
  }

  res.json({
    message: `Log ${id} deleted successfully`,
    deletedId: id,
    deletedAt: new Date().toISOString()
  });
};

// --- GITHUB API CONTROLLERS ---

export const githubAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: "Bad credentials", 
      documentation_url: "https://docs.github.com/rest" 
    });
  }
  // If token is provided, allow access
  next();
};

export const getGithubRepo = (req, res) => {
  const { owner, repo } = req.params;
  
  if (!owner || !repo) {
    return res.status(404).json({ message: "Not Found", documentation_url: "https://docs.github.com/rest/repos/repos#get-a-repository" });
  }

  const repoData = generateGithubRepo(owner, repo);
  res.json(repoData);
};

export const getGithubPulls = (req, res) => {
  const { owner, repo } = req.params;
  // Parse 'per_page' if provided, mimicking GitHub's pagination standard
  let count = 30; // GitHub default per_page
  if (req.query.per_page && !isNaN(parseInt(req.query.per_page))) {
    count = parseInt(req.query.per_page);
  }

  if (!owner || !repo) {
    return res.status(404).json({ message: "Not Found", documentation_url: "https://docs.github.com/rest/pulls/pulls#list-pull-requests" });
  }

  const pullsData = generateGithubPulls(owner, repo, count);
  res.json(pullsData);
};

export const getGithubSinglePull = (req, res) => {
  const { owner, repo, pull_number } = req.params;
  
  if (!owner || !repo || !pull_number) {
    return res.status(404).json({ 
      message: "Not Found", 
      documentation_url: "https://docs.github.com/rest/pulls/pulls#get-a-pull-request",
      status: "404"
    });
  }

  // Generate a list of pulls and try to match the number, or just return the first one modified to match
  const pullsData = generateGithubPulls(owner, repo, 1);
  const singlePull = pullsData[0];
  singlePull.number = parseInt(pull_number);
  singlePull.url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
  singlePull.html_url = `https://github.com/${owner}/${repo}/pull/${pull_number}`;
  singlePull.diff_url = `https://github.com/${owner}/${repo}/pull/${pull_number}.diff`;
  singlePull.patch_url = `https://github.com/${owner}/${repo}/pull/${pull_number}.patch`;
  singlePull.issue_url = `https://api.github.com/repos/${owner}/${repo}/issues/${pull_number}`;
  
  res.json(singlePull);
};
