const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function finalFix() {
  try {
    console.log('Final schema alignment...\n');

    // PRODUCTS TABLE - rename location to views
    console.log('1. Renaming products.location to views and changing type...');
    await sql`ALTER TABLE "products" DROP COLUMN "location"`;
    await sql`ALTER TABLE "products" ADD COLUMN "views" integer NOT NULL DEFAULT 0`;
    console.log('✅ Done');

    console.log('\n✅ All done! Schema should now match perfectly.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

finalFix();
