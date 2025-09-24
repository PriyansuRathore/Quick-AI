import  OpenAI  from "openai";
import sql  from '../configs/db.js';
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const generateArticle=async(req,res)=>{
    try{
        // Mock data for testing - replace with real auth later
        const userId = 'user_test123';
        
        const plan = 'free';
        const free_usage = 0;
        
        const {prompt ,length}=req.body;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false , message:'Free usage limit reached' })
        }
        
    const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens:length,
    });
    const content=response.choices[0].message.content

    await sql`INSERT INTO creations (user_id, prompt, content ) VALUES (${userId}, ${prompt}, ${content})`;
    // if(plan==='premium'){
    //     await clerkClient.users.updateUserMetadata(userId, {
    //         privateMetadata: {
    //             free_usage: free_usage + 1
    //         }
    //     })
    // }
    
    // Skip Clerk update for testing
    res.json({success:true, content})
    }catch (error){
        res.json({success:false, message:error.message})    
    }
}

// blog
export const generateBlogTitle=async(req,res)=>{
    try{
        // Mock data for testing - replace with real auth later
        //const {userId}=req.auth;
        const userId = 'user_test123';
        
        const plan = 'free';//req.plan;
        const free_usage = 0;//req.free_usage;
        
        const {prompt }=req.body;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false , message:'Free usage limit reached' })
        }
        
    const response = await AI.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.7,
        max_tokens:100,
    }); 
    const content=response.choices[0].message.content

    await sql`INSERT INTO creations (user_id, prompt, content ) VALUES (${userId}, ${prompt}, ${content})`;
    // if(plan==='premium'){
    //     await clerkClient.users.updateUserMetadata(userId, {
    //         privateMetadata: {
    //             free_usage: free_usage + 1
    //         }
    //     })
    // }
    
    // Skip Clerk update for testing
    res.json({success:true, content})
    }catch (error){
        res.json({success:false, message:error.message})    
    }
}

// generate image 
export const generateImage=async(req,res)=>{
    try{
        // Mock data for testing - replace with real auth later
        const userId = 'user_test123'; // const {userId}= req.auth();
        
        const plan = 'premium'; //req.plan
        // const free_usage = 0; // req.free_usage
        
        const {prompt,publish}=req.body;

        if(plan!=='premium' ){
            return res.json({success:false , message:'this feature is only available for premium subscriptions' })
        }
        
        const formData = new FormData()
        formData.append('prompt', prompt)
        const {data} = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                "x-api-key": process.env.CLIPDROP_API_KEY,
                ...formData.getHeaders()
            },
            responseType: 'arraybuffer',
        })

        const base64Image =`data:image/png;base64,${ Buffer.from(data, 'binary').toString('base64')}`;
        const {secure_url} =await cloudinary.uploader.upload(base64Image)

    await sql`INSERT INTO creations (user_id, prompt, content, publish) VALUES (${userId}, ${prompt}, ${secure_url}, ${publish ?? false})`;
    
    // Skip Clerk update for testing
    res.json({success:true, content:secure_url})
    }catch (error){
        res.json({success:false, message:error.message})    
    }
}

// remove background
export const removeImageBackground=async(req,res)=>{
    try{
        // Mock data for testing - replace with real auth later
        const userId = 'user_test123'; // const {userId}= req.auth();
        
        const plan = 'premium'; //req.plan
        // const free_usage = 0; // req.free_usage
        
        const image=req.file;

        if(plan!=='premium' ){
            return res.json({success:false , message:'this feature is only available for premium subscriptions' })
        }
        
        const {secure_url} =await cloudinary.uploader.upload(image.path,{
            transformation: [
                {
                    effect: "background_removal",
                    background_removal: 'remove_the_background'
                }
            ]
        })

    await sql`INSERT INTO creations (user_id, prompt, content) VALUES (${userId}, 'Remove background from image', ${secure_url})`;
    
    // Skip Clerk update for testing
    res.json({success:true, content:secure_url})
    }catch (error){
        res.json({success:false, message:error.message})    
    }
}

//removeImageObject

export const removeImageObject=async(req,res)=>{
    try{
        // Mock data for testing - replace with real auth later
        const userId = 'user_test123'; // const {userId}= req.auth();
        
        const plan = 'premium'; //req.plan
        // const free_usage = 0; // req.free_usage
        const image=req.file;
        const {object}=req.body;

        if(plan!=='premium' ){
            return res.json({success:false , message:'this feature is only available for premium subscriptions' })
        }
        
        const {public_id} =await cloudinary.uploader.upload(image.path)

        const imageUrl=cloudinary.url(public_id,{
            transformation: [{effect:`gen_remove:${object}`}],
            resource_type: 'image'
        })
            

    await sql`INSERT INTO creations (user_id, prompt, content) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl})`;
    
    // Skip Clerk update for testing
    res.json({success:true, content:imageUrl})
    }catch (error){
        res.json({success:false, message:error.message})    
    }
}

// Review Resume

export const resumeReview=async(req,res)=>{
    try{
        // Mock data for testing - replace with real auth later
        const userId = 'user_test123'; // const {userId}= req.auth();
        
        const plan = 'premium'; //req.plan
        // const free_usage = 0; // req.free_usage
        const resume=req.file;
        

        if(plan!=='premium' ){
            return res.json({success:false , message:'this feature is only available for premium subscriptions' })
        }
        
        if(resume.size >5*1024 *1024){
            return res.json({success:false,message:"Resume file size exceeds allowed size (5MB)."})
        }
        const dataBuffer=fs.readFileSync(resume.path)
        const pdfData= await pdf(dataBuffer)

        const prompt=`Review the following resume and provide constructive feedback on its strengths , weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens:1000,
    });
    const content=response.choices[0].message.content


    await sql`INSERT INTO creations (user_id, prompt, content) VALUES (${userId}, 'Review the uploaded resume', ${content})`;
    
        // Skip Clerk update for testing
        res.json({success:true, content})
    }catch (error){
        res.json({success:false, message:error.message})    
    }
}