import express from 'express';
const adminRouter = express.Router();

import { adminLogin, approveProject, deleteInvestment, deleteProject, deleteUser, getAdminDashboardAnalytics, getAllInvestments, getApprovedProjects, getCompletedProjects, getDisputedInvestments, getFlaggedInvestments, getPendingProjects, getProjectById, getRejectedProjects, getSingleInvestment, getUserById, getUsers, messageUser, refundInvestment, rejectProject, resolveDispute, toggleSuspendUser } from '../controllers/adminController.js';
import { adminAuth } from '../middlewares/adminAuth.js';
import { deleteFeedback, getAllFeedbacks, getFeedbackById } from '../controllers/feedbackController.js';

adminRouter.post('/login', adminLogin);
adminRouter.get('/dashboard-analytics', adminAuth, getAdminDashboardAnalytics);

// ** Project Management Routes
adminRouter.get('/projects/pending', adminAuth, getPendingProjects);
adminRouter.get('/projects/approved', adminAuth, getApprovedProjects);
adminRouter.get('/projects/rejected', adminAuth, getRejectedProjects);
adminRouter.get('/projects/completed', adminAuth, getCompletedProjects);
adminRouter.get('/project/view/:id', adminAuth, getProjectById);
adminRouter.put('/project/approve/:id', adminAuth, approveProject);
adminRouter.put('/project/reject/:id', adminAuth, rejectProject);
adminRouter.delete('/project/delete/:id', adminAuth, deleteProject);

//** Investment Routes
adminRouter.get("/investments/all", adminAuth, getAllInvestments);
adminRouter.get("/investments/flagged", adminAuth, getFlaggedInvestments);
adminRouter.get("/investments/disputed", adminAuth, getDisputedInvestments);
adminRouter.post("/investments/refund", adminAuth, refundInvestment);
adminRouter.post("/investments/resolve-dispute", adminAuth, resolveDispute);
adminRouter.get('/investment/view/:projectId/:paymentRef', adminAuth, getSingleInvestment);
adminRouter.delete('/investment/delete/:paymentRef', adminAuth, deleteInvestment);

// User Management
adminRouter.get("/users", adminAuth, getUsers);
adminRouter.get("/users/profile/:id", adminAuth, getUserById);
adminRouter.delete("/users/delete/:id", adminAuth, deleteUser);
adminRouter.post("/users/:id/message", adminAuth, messageUser);
adminRouter.patch("/users/:id/suspend", adminAuth, toggleSuspendUser);

// User feedbacks
adminRouter.get("/feedbacks/all", adminAuth, getAllFeedbacks);
adminRouter.get("/feedback/:id", adminAuth, getFeedbackById);
adminRouter.delete("/feedback/:id", adminAuth, deleteFeedback);

export default adminRouter;