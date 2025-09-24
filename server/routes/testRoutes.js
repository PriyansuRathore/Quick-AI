import express from 'express';
import { clerkClient } from '@clerk/express';

const testRouter = express.Router();

// Test route to create a user session token
testRouter.post('/get-test-token', async (req, res) => {
    try {
        // This is for testing only - create a test user
        const users = await clerkClient.users.getUserList();
        if (users.length > 0) {
            const user = users[0];
            res.json({
                message: 'Use this userId for testing',
                userId: user.id,
                note: 'You still need a proper JWT token from frontend'
            });
        } else {
            res.json({
                message: 'No users found. Create a user in Clerk Dashboard first'
            });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
});

export default testRouter;