import { Router } from 'express';
import * as studyController from '../controllers/studyController.js';
import * as growthController from '../controllers/growthController.js';
import * as userController from '../controllers/userController.js';
import * as attendanceController from '../controllers/attendanceController.js';
import * as planController from '../controllers/planController.js';
import * as focusMonitorController from '../controllers/focusMonitorController.js';
import * as reportController from '../controllers/reportController.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'learners-high-api' });
});

apiRouter.get('/users/demo', userController.getDemoUser);

apiRouter.post('/attendance/check-in', attendanceController.checkIn);
apiRouter.post('/attendance/check-out', attendanceController.checkOut);
apiRouter.get('/attendance/active/:userId', attendanceController.getActive);

apiRouter.get('/focus-monitor/state/:userId', focusMonitorController.getState);
apiRouter.get('/focus-monitor/catalog', focusMonitorController.getCatalog);

apiRouter.get('/plans', planController.listPlans);
apiRouter.post('/plans', planController.createPlan);
apiRouter.patch('/plans/:id', planController.updatePlan);
apiRouter.delete('/plans/:id', planController.deletePlan);

apiRouter.post('/study/session/start', studyController.startSession);
apiRouter.post('/study/session/end', studyController.endSession);
apiRouter.post('/study/session/abandon', studyController.abandonSession);
apiRouter.get('/study/session/active/:userId', studyController.getActiveSession);
apiRouter.post('/mock-ai/event', studyController.injectAiEvent);

apiRouter.get('/growth/:userId', growthController.getGrowth);
apiRouter.get('/growth/:userId/history', growthController.getGrowthHistory);
apiRouter.get('/milestones/:userId', growthController.getMilestones);
apiRouter.get('/goals/:userId', growthController.getGoals);

apiRouter.get('/reports/daily/:userId', reportController.getDailyReportHandler);
apiRouter.get('/reports/monthly/:userId', reportController.getMonthlyReportHandler);
apiRouter.get('/reports/ranking', reportController.getRankingHandler);
