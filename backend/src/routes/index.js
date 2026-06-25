import { Router } from 'express';
import { handleInput } from '../controllers/input.controller.js';
import { handleOptimize } from '../controllers/optimize.controller.js';
import { handleResults } from '../controllers/results.controller.js';

const router = Router();

router.post('/input', handleInput);
router.post('/optimize', handleOptimize);
router.get('/results', handleResults);

export default router;
