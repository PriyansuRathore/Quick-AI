import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {clerkMiddleware, requireAuth} from '@clerk/express'
import aiRouter from './routes/airoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import sql from './configs/db.js';

const app= express();

await connectCloudinary()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/',(req,res)=>{
    res.send("Server is live");
})

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await sql`SELECT NOW() as current_time`;
        res.json({ 
            success: true, 
            message: 'Database connected successfully!', 
            timestamp: result[0].current_time 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            message: 'Database connection failed', 
            error: error.message 
        });
    }
})
app.use('/api/ai', aiRouter)  
app.use('/api/user', userRouter)  

const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})