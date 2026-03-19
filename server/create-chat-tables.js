import 'dotenv/config';
import sql from './configs/db.js';

async function createChatTables() {
    try {
        // Create conversations table
        await sql`
            CREATE TABLE IF NOT EXISTS conversations (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) DEFAULT 'New Chat',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('Conversations table created successfully');

        // Create messages table
        await sql`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
                role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('Messages table created successfully');

        // Create index for better performance
        await sql`
            CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)
        `;
        console.log('Database indexes created successfully');

        console.log('All chat tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating chat tables:', error);
        process.exit(1);
    }
}

createChatTables();