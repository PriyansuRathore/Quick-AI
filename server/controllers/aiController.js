import  OpenAI  from "openai";
import sql  from '../configs/db.js';
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import FormData from "form-data";
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js'

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
        const pdfData= await pdfParse(dataBuffer)

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

// Chat Functions
export const getConversations = async (req, res) => {
    try {
        const userId = 'user_test123';
        const conversations = await sql`
            SELECT c.*, 
                   (SELECT content FROM messages WHERE conversation_id = c.id AND role = 'user' ORDER BY created_at DESC LIMIT 1) as last_message
            FROM conversations c 
            WHERE user_id = ${userId} 
            ORDER BY updated_at DESC
        `;
        res.json({ success: true, conversations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await sql`
            SELECT * FROM messages 
            WHERE conversation_id = ${conversationId} 
            ORDER BY created_at ASC
        `;
        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const userId = 'user_test123';
        const { conversationId, message } = req.body;
        
        // Save user message
        await sql`
            INSERT INTO messages (conversation_id, role, content) 
            VALUES (${conversationId}, 'user', ${message})
        `;
        
        // Get conversation context (last 10 messages)
        const context = await sql`
            SELECT role, content FROM messages 
            WHERE conversation_id = ${conversationId} 
            ORDER BY created_at DESC LIMIT 10
        `;
        
        // Build conversation for AI
        const messages = context.reverse().map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        // Get AI response
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000,
        });
        
        const aiResponse = response.choices[0].message.content;
        
        // Save AI response
        const savedMessage = await sql`
            INSERT INTO messages (conversation_id, role, content) 
            VALUES (${conversationId}, 'assistant', ${aiResponse})
            RETURNING *
        `;
        
        // Also save to creations table for dashboard
        await sql`
            INSERT INTO creations (user_id, prompt, content) 
            VALUES (${userId}, ${`Chat: ${message}`}, ${aiResponse})
        `;
        
        // Update conversation timestamp
        await sql`
            UPDATE conversations 
            SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = ${conversationId}
        `;
        
        res.json({ success: true, message: savedMessage[0] });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const createConversation = async (req, res) => {
    try {
        const userId = 'user_test123';
        const { title = 'New Chat' } = req.body;
        
        const conversation = await sql`
            INSERT INTO conversations (user_id, title) 
            VALUES (${userId}, ${title})
            RETURNING *
        `;
        
        res.json({ success: true, conversation: conversation[0] });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
