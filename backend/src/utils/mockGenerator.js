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
