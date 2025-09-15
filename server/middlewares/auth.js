//This code is an Express middleware using Clerk for authentication and user management.
// It checks if the logged-in user has a premium plan or if they’re still on the free usage quota.

// User makes a request.
// Clerk authentication runs → extracts userID and plan.
// Middleware checks:
// If premium user → mark req.plan = "premium", continue.
// If free user with usage left → attach req.free_usage.
// If free user but no usage left → reset usage to 0, set req.plan = "free", continue.

// Routes can now check req.plan or req.free_usage to enforce limits.
// Middleware to check UserId and hasPremiumPlan

import { clerkClient } from "@clerk/express";

export const auth = async(req ,res,next)=>{
    try{
        const {userID ,has}=await req.auth();
        const hasPremiumPlan=await has ({plan:'premium'});
        const user= await clerkClient.users.getUser(userID);
        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage=user.privateMetadata.free_usage
        } else{
            await clerkClient.users.updateUserMetadata(userID,{
                privateMetadata:{
                    free_usage:0
                }
            })
            req.free_usage=0
            
        }
        req.plan=hasPremiumPlan ? 'premium' : 'free';
        next()
    } catch(error){
        res.json({success:false ,message:error.message})
    }
}