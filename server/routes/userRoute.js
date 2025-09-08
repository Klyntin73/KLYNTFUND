import express from 'express';
import {
   registerUser, loginUser,
   updateProfile, getUserProfile
} from '../controllers/userController.js';
import {
   addProject, creatorDashboard, editProject,
   getAllProjects, myProject, viewProject, getProjectById,
   searchProjects, getSuggestions
} from '../controllers/projectController.js';
import upload from '../middlewares/multer.js';
import authUser from '../middlewares/authUser.js';
import uploadProfileImage from '../middlewares/profileUpload.js';
import { createFeedback } from '../controllers/feedbackController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post("/feedback/add", createFeedback);

// User Routes
userRouter.get('/creator/dashboard', authUser, creatorDashboard);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update-profile', uploadProfileImage.single('profileImage'), authUser, updateProfile);

// Project Routes
userRouter.get('/my-project', authUser, myProject);
userRouter.post('/add-project', authUser, upload.single('thumbnail'), addProject);
userRouter.get('/projects', getAllProjects);
userRouter.get('/projects/:id', authUser, viewProject);
userRouter.get('/get-project/:id', authUser, getProjectById);
userRouter.post('/edit-project/:id', authUser, upload.single('thumbnail'), editProject);

// Search Route
userRouter.get('/search', searchProjects);
userRouter.get('/search/suggestions', getSuggestions);

export default userRouter;