import express from "express";
import { getUserCreations, getPublishedCreations, toggleLikeCreation } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/get-user-creations',getUserCreations)
userRouter.get('/get-published-creations', getPublishedCreations)
userRouter.post('/toggle-like-creation', toggleLikeCreation)

export default userRouter;