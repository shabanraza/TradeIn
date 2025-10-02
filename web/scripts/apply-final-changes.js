const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function applyFinalChanges() {
  try {
    console.log('Applying final schema changes...\n');

    // Orders table
    console.log('1. Orders table changes...');
    await sql`ALTER TABLE "orders" ALTER COLUMN "shipping_address" SET NOT NULL`;
    await sql`ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_user_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "orders" ADD CONSTRAINT "orders_retailer_id_user_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action`;

    // Session table
    console.log('2. Session table changes...');
    await sql`ALTER TABLE "session" ALTER COLUMN "createdAt" SET NOT NULL`;
    await sql`ALTER TABLE "session" ALTER COLUMN "updatedAt" SET NOT NULL`;

    // Account table
    console.log('3. Account table changes...');
    await sql`ALTER TABLE "account" ALTER COLUMN "type" DROP NOT NULL`;
    await sql`ALTER TABLE "account" ALTER COLUMN "scope" SET DATA TYPE text`;
    await sql`ALTER TABLE "account" ALTER COLUMN "createdAt" SET NOT NULL`;
    await sql`ALTER TABLE "account" ALTER COLUMN "updatedAt" SET NOT NULL`;

    // Products table
    console.log('4. Products table changes...');
    await sql`ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL`;
    await sql`ALTER TABLE "products" ALTER COLUMN "brand" DROP NOT NULL`;
    await sql`ALTER TABLE "products" ALTER COLUMN "model" DROP NOT NULL`;
    await sql`ALTER TABLE "products" ALTER COLUMN "images" DROP DEFAULT`;
    await sql`ALTER TABLE "products" ALTER COLUMN "images" DROP NOT NULL`;
    await sql`ALTER TABLE "products" ALTER COLUMN "specifications" DROP DEFAULT`;
    await sql`ALTER TABLE "products" ALTER COLUMN "is_sold" SET DEFAULT false`;
    await sql`ALTER TABLE "products" ADD CONSTRAINT "products_retailer_id_user_id_fk" FOREIGN KEY ("retailer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action`;
    await sql`ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action`;

    console.log('\n✅ All changes applied successfully!');

  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Some constraints already exist - continuing...');
    } else {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }
}

applyFinalChanges();
