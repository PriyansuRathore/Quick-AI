// import * as res from 'express/lib/response';
import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


export const generateArticle=async(req , res)=>{
    try{
        const {userID}= req.auth();
        const {prompt,length}=req.body;
        const plan=req.plan;
        const free_usage=req.free_usage;

        if(plan!=='premium' && free_usage>=10){
            return res.json({success:false,message:'Free usage limit reached. Upgrade to continue.'})
        }
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature:0.7,
    max_tokens:length,
});
    const content= response.choices[0].message.content
    console.log(content)
    await sql `INSERT INTO creations (user_id, prompt,content,type) 
    VALUES (${userID}, ${prompt}, ${content}, 'article')`;

    if(plan !=='premium'){
        await clerkClient.users.updateUserMetadata(userID,{
            privateMetadata:{
                free_usage:free_usage+1
            }
        })
    }
    res.json({success:true, content})               
    } catch(error){
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}