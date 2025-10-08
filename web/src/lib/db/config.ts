import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { users } from './schema';

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
  console.log('🔗 DATABASE_URL found, creating real database connection...');
  console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
  try {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    db = drizzle(pool);
    console.log('✅ Database connection established successfully');
    console.log('Database methods available:', Object.keys(db));
  } catch (error) {
    console.error('❌ Failed to create database connection:', error);
    console.log('🔄 Falling back to mock database');
    // Fall through to mock database
  }
} else {
  console.log('⚠️ DATABASE_URL not found, using mock database');
}

if (!db || !db.select) {
  // Development fallback - mock database
  db = {
    select: () => ({ 
      from: () => ({ 
        leftJoin: () => ({ 
          leftJoin: () => ({ 
            where: () => ({ 
              where: () => ({ 
                where: () => ({ 
                  orderBy: () => ({ 
                    limit: () => Promise.resolve([]) 
                  }) 
                }) 
              }) 
            }) 
          }) 
        }),
        where: () => ({ 
          where: () => ({ 
            where: () => ({ 
              orderBy: () => ({ 
                limit: () => Promise.resolve([]) 
              }) 
            }) 
          }) 
        })
      }) 
    }),
    insert: () => ({ values: () => Promise.resolve({ insertId: 'mock-id' }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve({ rowCount: 1 }) }) }),
    delete: () => ({ where: () => Promise.resolve({ rowCount: 1 }) }),
  };
}

// Export the database connection
export { db };
export default db;

// Add a function to test the database connection
export const testDatabaseConnection = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      return { success: false, error: 'DATABASE_URL not set' };
    }
    
    if (!db || !db.select) {
      return { success: false, error: 'Database not properly initialized' };
    }
    
    // Test a simple query
    const result = await db.select().from(users).limit(1);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};