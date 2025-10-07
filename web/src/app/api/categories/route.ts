import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { categories } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching categories...');
    
    const categoriesList = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));

    console.log('Categories found:', categoriesList.length);

    return NextResponse.json({
      success: true,
      categories: categoriesList
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, image } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    console.log('Creating category:', { name, description, image });

    const newCategory = await db
      .insert(categories)
      .values({
        name,
        description,
        image,
      })
      .returning();

    console.log('Category created:', newCategory[0]);

    return NextResponse.json({
      success: true,
      category: newCategory[0]
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
