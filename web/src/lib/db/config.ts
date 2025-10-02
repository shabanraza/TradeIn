import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️  DATABASE_URL not found. Using development fallback.');
    console.warn('📝 Please create .env.local with your Neon PostgreSQL connection string:');
    console.warn('📝 DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"');
    console.warn('🔧 The app will work without database for now, but authentication and data features will be limited.');
  }
}

// Create database connection or fallback
let db: any;

if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool);
} else {
  // Development fallback - mock database
  db = {
    select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    insert: () => ({ values: () => Promise.resolve({ insertId: 'mock-id' }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve({ rowCount: 1 }) }) }),
    delete: () => ({ where: () => Promise.resolve({ rowCount: 1 }) }),
  };
}

export { db };
export default db;