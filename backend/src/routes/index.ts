import { Router } from 'express';
import * as studyController from '../controllers/studyController.js';
import * as growthController from '../controllers/growthController.js';
import * as userController from '../controllers/userController.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'learners-high-api' });
});

apiRouter.get('/users/demo', userController.getDemoUser);

apiRouter.post('/study/session/start', studyController.startSession);
apiRouter.post('/study/session/end', studyController.endSession);
apiRouter.get('/study/session/active/:userId', studyController.getActiveSession);
apiRouter.post('/mock-ai/event', studyController.injectAiEvent);

apiRouter.get('/growth/:userId', growthController.getGrowth);
apiRouter.get('/milestones/:userId', growthController.getMilestones);
apiRouter.get('/goals/:userId', growthController.getGoals);
