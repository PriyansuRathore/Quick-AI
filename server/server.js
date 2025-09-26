import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import {clerkMiddleware, requireAuth} from '@clerk/express'
import aiRouter from './routes/airoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app= express();

await connectCloudinary()

// CORS configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

app.get('/',(req,res)=>{
    res.send("Server is live");
})
app.use('/api/ai', aiRouter)  
app.use('/api/user', userRouter)  

const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})