const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function addUniqueConstraint() {
  try {
    console.log('Adding unique constraint to session.token...\n');

    // Add unique constraint to session token
    await sql`ALTER TABLE "session" ADD CONSTRAINT "session_token_unique" UNIQUE ("token")`;
    
    console.log('✅ Unique constraint added successfully!');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Unique constraint already exists!');
    } else {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }
}

addUniqueConstraint();
