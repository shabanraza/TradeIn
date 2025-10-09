import { getDatabaseInfo } from '@/lib/db/config';

export const runtime = 'nodejs';

export async function GET() {
  const dbInfo = getDatabaseInfo();
  
  return Response.json({
    hasDbUrl: Boolean(process.env.DATABASE_URL),
    dbUrlLength: process.env.DATABASE_URL?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: dbInfo,
  });
}
