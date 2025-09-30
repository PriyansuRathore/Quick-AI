import 'dotenv/config';
import sql from './configs/db.js';

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...');
        const result = await sql`SELECT NOW() as current_time, 'Database connected!' as message`;
        console.log('✅ Database Status:', result[0].message);
        console.log('⏰ Current Time:', result[0].current_time);
        
        // Test creations table
        const tableTest = await sql`SELECT COUNT(*) as count FROM creations`;
        console.log('📊 Total creations in database:', tableTest[0].count);
        
        console.log('🎉 Database is working perfectly!');
    } catch (error) {
        console.log('❌ Database Error:', error.message);
        console.log('🔧 Check your DATABASE_URL in .env file');
    }
    process.exit();
}

testDatabase();