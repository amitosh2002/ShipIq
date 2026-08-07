import { Router } from 'express';
import { handleInput } from '../controllers/input.controller.js';
import { handleOptimize } from '../controllers/optimize.controller.js';
import { handleResults } from '../controllers/results.controller.js';
import { 
  getMetadata, 
  getLogs, 
  getDeployments, 
  getNotifications, 
  getProjects,
  advancedSearch,
  updateProject,
  deleteLog,
  chaosMiddleware
} from '../controllers/interview.controller.js';

const router = Router();

router.post('/input', handleInput);
router.post('/optimize', handleOptimize);
router.get('/results', handleResults);

// Interview Mock API Routes
// Apply chaos middleware to simulate real-world random API failures (20%)
router.use(['/metadata', '/logs', '/deployments', '/notifications', '/projects', '/search'], chaosMiddleware);

router.get('/metadata', getMetadata);
router.get('/logs', getLogs);
router.get('/deployments', getDeployments);
router.get('/notifications', getNotifications);
router.get('/projects', getProjects);
router.post('/search', advancedSearch);
router.put('/projects/:id', updateProject);
router.delete('/logs/:id', deleteLog);

export default router;
