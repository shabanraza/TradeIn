const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function fixBetterAuthSchema() {
  try {
    console.log('Fixing Better Auth schema to match exact requirements...\n');

    // 1. Fix user table - change id from uuid to text
    console.log('1. Updating user table...');
    await sql`ALTER TABLE "user" ALTER COLUMN "id" TYPE text`;
    console.log('✅ User table ID changed to text');

    // 2. Fix account table - change id and userId from uuid to text
    console.log('2. Updating account table...');
    await sql`ALTER TABLE "account" ALTER COLUMN "id" TYPE text`;
    await sql`ALTER TABLE "account" ALTER COLUMN "userId" TYPE text`;
    console.log('✅ Account table IDs changed to text');

    // 3. Fix session table - change id and userId from uuid to text
    console.log('3. Updating session table...');
    await sql`ALTER TABLE "session" ALTER COLUMN "id" TYPE text`;
    await sql`ALTER TABLE "session" ALTER COLUMN "userId" TYPE text`;
    console.log('✅ Session table IDs changed to text');

    // 4. Fix verification table - change id to text with default
    console.log('4. Updating verification table...');
    await sql`ALTER TABLE "verification" ALTER COLUMN "id" TYPE text`;
    console.log('✅ Verification table ID changed to text');

    // 5. Update timestamp columns to have timezone
    console.log('5. Updating timestamp columns...');
    
    // User table timestamps
    await sql`ALTER TABLE "user" ALTER COLUMN "emailVerified" TYPE timestamptz`;
    await sql`ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    
    // Account table timestamps
    await sql`ALTER TABLE "account" ALTER COLUMN "expires_at" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "accessTokenExpiresAt" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "refreshTokenExpiresAt" TYPE timestamptz`;
    
    // Session table timestamps
    await sql`ALTER TABLE "session" ALTER COLUMN "expiresAt" TYPE timestamptz`;
    await sql`ALTER TABLE "session" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "session" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    
    // Verification table timestamps
    await sql`ALTER TABLE "verification" ALTER COLUMN "expiresAt" TYPE timestamptz`;
    await sql`ALTER TABLE "verification" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "verification" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    
    console.log('✅ All timestamp columns updated to timestamptz');

    console.log('\n✅ Better Auth schema fixed successfully!');
    console.log('Now run: pnpm run db:push to verify the schema matches');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fixBetterAuthSchema();
