import { NextRequest, NextResponse } from 'next/server';
import { db, testDatabaseConnection } from '@/lib/db/config';
import { phoneBrands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching phone brands...');
    
    // Test database connection
    console.log('🔍 Testing database connection for phone brands...');
    const dbTest = await testDatabaseConnection();
    if (!dbTest.success) {
      console.error('❌ Database connection test failed:', dbTest.error);
      return NextResponse.json({
        success: false,
        error: 'Database connection test failed',
        details: dbTest.error
      }, { status: 500 });
    }
    console.log('✅ Database connection test passed for phone brands');
    
    const brands = await db
      .select()
      .from(phoneBrands)
      .orderBy(phoneBrands.name);

    console.log('Phone brands found:', brands.length);

    return NextResponse.json({
      success: true,
      brands
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': `"${Date.now()}"`,
      }
    });

  } catch (error) {
    console.error('Error fetching phone brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, icon } = await request.json();
    
    console.log('Creating phone brand:', { name, description });

    // Clean the name (trim whitespace and normalize case)
    const cleanName = name.trim();
    
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // Check if brand already exists (case-insensitive)
    const existingBrands = await db
      .select()
      .from(phoneBrands);

    const existingBrand = existingBrands.find((brand: any) => 
      brand.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingBrand) {
      return NextResponse.json(
        { 
          error: `Brand "${existingBrand.name}" already exists. Please choose a different name.`,
          existingBrand: existingBrand
        },
        { status: 409 }
      );
    }

    // Create brand
    const [brand] = await db.insert(phoneBrands).values({
      name: cleanName,
      description: description?.trim() || '',
      icon: icon?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Phone brand created:', brand.id);

    return NextResponse.json({
      success: true,
      message: 'Phone brand created successfully',
      brand
    });

  } catch (error) {
    console.error('Error creating phone brand:', error);
    
    // Check if it's a unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A brand with this name already exists. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create phone brand' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, icon } = await request.json();
    
    console.log('Updating phone brand:', { id, name, description });

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // Clean the name (trim whitespace and normalize case)
    const cleanName = name.trim();
    
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // Check if brand already exists with different ID (case-insensitive)
    const existingBrands = await db
      .select()
      .from(phoneBrands)
      .where(eq(phoneBrands.id, id));

    const otherBrands = await db
      .select()
      .from(phoneBrands);

    const existingBrand = otherBrands.find((brand: any) => 
      brand.id !== id && brand.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingBrand) {
      return NextResponse.json(
        { 
          error: `Brand "${existingBrand.name}" already exists. Please choose a different name.`,
          existingBrand: existingBrand
        },
        { status: 409 }
      );
    }

    // Update brand
    const [updatedBrand] = await db
      .update(phoneBrands)
      .set({
        name: cleanName,
        description: description?.trim() || '',
        icon: icon?.trim() || '',
        updatedAt: new Date()
      })
      .where(eq(phoneBrands.id, id))
      .returning();

    if (!updatedBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    console.log('Phone brand updated:', updatedBrand.id);

    return NextResponse.json({
      success: true,
      message: 'Phone brand updated successfully',
      brand: updatedBrand
    });

  } catch (error) {
    console.error('Error updating phone brand:', error);
    
    return NextResponse.json(
      { error: 'Failed to update phone brand' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Deleting phone brand:', { id });

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // Check if brand exists
    const existingBrand = await db
      .select()
      .from(phoneBrands)
      .where(eq(phoneBrands.id, id))
      .limit(1);

    if (!existingBrand.length) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Delete brand
    await db
      .delete(phoneBrands)
      .where(eq(phoneBrands.id, id));

    console.log('Phone brand deleted:', id);

    return NextResponse.json({
      success: true,
      message: 'Phone brand deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting phone brand:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete phone brand' },
      { status: 500 }
    );
  }
}
