import express from 'express';
import authUser from '../middlewares/authUser.js';
import {
   verifyAndAddInvestment, getInvestorDashboardStats,
   getMyInvestments,
   getInvestmentHistory
} from '../controllers/investmentController.js';
const investmentRouter = express.Router();

investmentRouter.post('/invest', authUser, verifyAndAddInvestment);
investmentRouter.get('/investor-stats', authUser, getInvestorDashboardStats);
investmentRouter.get('/my-investment', authUser, getMyInvestments);
investmentRouter.get('/investment-history', authUser, getInvestmentHistory);

export default investmentRouter;