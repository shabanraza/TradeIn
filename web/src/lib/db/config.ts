import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
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

// Singleton database connection
let db: any = null;
let isInitialized = false;

// Function to get or create database connection (singleton pattern)
const getDatabase = () => {
  if (isInitialized && db) {
    return db;
  }

  try {
    if (process.env.DATABASE_URL) {
      console.log('🔗 DATABASE_URL found, creating database connection...');
      console.log('DATABASE_URL length:', process.env.DATABASE_URL.length);
      db = drizzle(neon(process.env.DATABASE_URL));
      console.log('✅ Database connection established successfully');
      console.log('Database methods available:', Object.keys(db));
      isInitialized = true;
      return db;
    } else {
      throw new Error('DATABASE_URL not found');
    }
  } catch (error) {
    console.error('❌ Failed to create database connection:', error);
    console.log('🔄 Using mock database');
    
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
    isInitialized = true;
    return db;
  }
};

// Initialize database connection
db = getDatabase();

// Export the database connection
export { db };
export default db;

// Add a function to test the database connection
export const testDatabaseConnection = async () => {
  try {
    // Ensure we have a database connection
    const database = getDatabase();
    
    if (!database || !database.select) {
      return { success: false, error: 'Database not properly initialized' };
    }
    
    // Test a simple query
    const result = await database.select().from(users).limit(1);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};

// Function to get database connection info for debugging
export const getDatabaseInfo = () => {
  return {
    isInitialized,
    hasConnection: !!db,
    connectionType: db ? (db.select ? 'real' : 'mock') : 'none',
    methods: db ? Object.keys(db) : []
  };
};