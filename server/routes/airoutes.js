import express from "express";
import { auth } from "../middlewares/auth.js";
import { generateArticle, generateBlogTitle, generateImage,removeImageBackground,removeImageObject,resumeReview,pdfChat } from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter=express.Router();
aiRouter.post('/generate-article', generateArticle)
aiRouter.post('/generate-blog-title', generateBlogTitle)
aiRouter.post('/generate-image', generateImage)
aiRouter.post('/remove-image-background', upload.single('image'), removeImageBackground)
aiRouter.post('/remove-image-object',upload.single('image'), removeImageObject)
aiRouter.post('/resume-review',upload.single('resume') , resumeReview)
aiRouter.post('/pdf-chat',upload.single('pdf') , pdfChat)
aiRouter.get('/test-pdf-chat', (req, res) => {
    res.json({ success: true, message: 'PDF Chat endpoint is working!' })
})
aiRouter.post('/test-pdf-post', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.json({ success: true, message: 'POST request working!', body: req.body })
})

export default aiRouter;