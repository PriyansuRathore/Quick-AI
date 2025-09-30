import express from "express";
import { auth } from "../middlewares/auth.js";
import { generateArticle, generateBlogTitle, generateImage,removeImageBackground,removeImageObject,resumeReview,getConversations,getMessages,sendMessage,createConversation } from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter=express.Router();
aiRouter.post('/generate-article', generateArticle)
aiRouter.post('/generate-blog-title', generateBlogTitle)
aiRouter.post('/generate-image', generateImage)
aiRouter.post('/remove-image-background', upload.single('image'), removeImageBackground)
aiRouter.post('/remove-image-object',upload.single('image'), removeImageObject)
aiRouter.post('/resume-review',upload.single('resume') , resumeReview)

// Chat routes
aiRouter.get('/conversations', getConversations)
aiRouter.get('/messages/:conversationId', getMessages)
aiRouter.post('/send-message', sendMessage)
aiRouter.post('/create-conversation', createConversation)

export default aiRouter;