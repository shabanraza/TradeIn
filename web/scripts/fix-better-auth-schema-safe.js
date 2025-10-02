const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function fixBetterAuthSchemaSafe() {
  try {
    console.log('Fixing Better Auth schema safely...\n');

    // 1. Drop all foreign key constraints first
    console.log('1. Dropping foreign key constraints...');
    try {
      await sql`ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_userId_user_id_fk"`;
      await sql`ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_userId_user_id_fk"`;
      await sql`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_customer_id_user_id_fk"`;
      await sql`ALTER TABLE "orders" DROP CONSTRAINT IF EXISTS "orders_retailer_id_user_id_fk"`;
      await sql`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_retailer_id_user_id_fk"`;
      console.log('✅ Foreign key constraints dropped');
    } catch (error) {
      console.log('⚠️  Some constraints may not exist:', error.message);
    }

    // 2. Update user table
    console.log('2. Updating user table...');
    await sql`ALTER TABLE "user" ALTER COLUMN "id" TYPE text`;
    await sql`ALTER TABLE "user" ALTER COLUMN "emailVerified" TYPE timestamptz`;
    await sql`ALTER TABLE "user" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "user" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    console.log('✅ User table updated');

    // 3. Update account table
    console.log('3. Updating account table...');
    await sql`ALTER TABLE "account" ALTER COLUMN "id" TYPE text`;
    await sql`ALTER TABLE "account" ALTER COLUMN "userId" TYPE text`;
    await sql`ALTER TABLE "account" ALTER COLUMN "expires_at" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "accessTokenExpiresAt" TYPE timestamptz`;
    await sql`ALTER TABLE "account" ALTER COLUMN "refreshTokenExpiresAt" TYPE timestamptz`;
    console.log('✅ Account table updated');

    // 4. Update session table
    console.log('4. Updating session table...');
    await sql`ALTER TABLE "session" ALTER COLUMN "id" TYPE text`;
    await sql`ALTER TABLE "session" ALTER COLUMN "userId" TYPE text`;
    await sql`ALTER TABLE "session" ALTER COLUMN "expiresAt" TYPE timestamptz`;
    await sql`ALTER TABLE "session" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "session" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    console.log('✅ Session table updated');

    // 5. Update verification table
    console.log('5. Updating verification table...');
    await sql`ALTER TABLE "verification" ALTER COLUMN "id" TYPE text`;
    await sql`ALTER TABLE "verification" ALTER COLUMN "expiresAt" TYPE timestamptz`;
    await sql`ALTER TABLE "verification" ALTER COLUMN "createdAt" TYPE timestamptz`;
    await sql`ALTER TABLE "verification" ALTER COLUMN "updatedAt" TYPE timestamptz`;
    console.log('✅ Verification table updated');

    // 6. Update other tables that reference user.id
    console.log('6. Updating other tables...');
    await sql`ALTER TABLE "orders" ALTER COLUMN "customer_id" TYPE text`;
    await sql`ALTER TABLE "orders" ALTER COLUMN "retailer_id" TYPE text`;
    await sql`ALTER TABLE "products" ALTER COLUMN "retailer_id" TYPE text`;
    console.log('✅ Other tables updated');

    // 7. Recreate foreign key constraints
    console.log('7. Recreating foreign key constraints...');
    await sql`ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "orders" ADD CONSTRAINT "orders_retailer_id_user_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "products" ADD CONSTRAINT "products_retailer_id_user_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    console.log('✅ Foreign key constraints recreated');

    console.log('\n✅ Better Auth schema fixed successfully!');
    console.log('Now run: pnpm run db:push to verify the schema matches');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

fixBetterAuthSchemaSafe();
