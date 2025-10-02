import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';

export async function POST(request: NextRequest) {
  try {
    console.log('Adding createdAt column to session table...');
    
    // Check if createdAt column exists
    const checkCreatedAt = await db.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'session' AND column_name = 'createdAt';
    `);
    
    if (checkCreatedAt.rows.length === 0) {
      // Add createdAt column
      await db.execute(`
        ALTER TABLE session ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `);
      console.log('Added createdAt column to session table');
    } else {
      console.log('createdAt column already exists');
    }

    // Check if updatedAt column exists
    const checkUpdatedAt = await db.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'session' AND column_name = 'updatedAt';
    `);
    
    if (checkUpdatedAt.rows.length === 0) {
      // Add updatedAt column
      await db.execute(`
        ALTER TABLE session ADD COLUMN "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `);
      console.log('Added updatedAt column to session table');
    } else {
      console.log('updatedAt column already exists');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Session table updated with createdAt and updatedAt columns'
    });
  } catch (error) {
    console.error('Fix session createdAt error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
