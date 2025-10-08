import { NextRequest, NextResponse } from 'next/server';
import { db, testDatabaseConnection } from '@/lib/db/config';
import { products, categories, users } from '@/lib/db/schema';
import { eq, desc, and, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const retailerId = searchParams.get('retailerId');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    
    console.log('Fetching products...', { categoryId, retailerId, search, limit });
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    console.log('Database object type:', typeof db);
    console.log('Database has select method:', typeof db.select);
    
    // Test database connection
    const dbTest = await testDatabaseConnection();
    if (!dbTest.success) {
      console.error('❌ Database connection test failed:', dbTest.error);
      return NextResponse.json({
        success: false,
        error: 'Database connection test failed',
        details: dbTest.error
      }, { status: 500 });
    }
    console.log('✅ Database connection test passed');

    let query = db
      .select({
        id: products.id,
        name: products.name,
        title: products.title,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        discountPrice: products.discountPrice,
        discountPercentage: products.discountPercentage,
        condition: products.condition,
        phoneType: products.phoneType,
        categoryId: products.categoryId,
        retailerId: products.retailerId,
        images: products.images,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          description: categories.description,
          image: categories.image
        },
        retailer: {
          id: users.id,
          name: users.name,
          businessName: users.businessName,
          location: users.location
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(users, eq(products.retailerId, users.id))
      .where(eq(products.isActive, true));

    if (categoryId) {
      query = query.where(eq(products.categoryId, categoryId));
    }

    if (retailerId) {
      query = query.where(eq(products.retailerId, retailerId));
    }

    if (search) {
      query = query.where(like(products.name, `%${search}%`));
    }

    const productsList = await query
      .orderBy(desc(products.createdAt))
      .limit(limit ? parseInt(limit) : 50);

    console.log('Products found:', productsList.length);

    return NextResponse.json({
      success: true,
      products: productsList
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, condition, categoryId, retailerId, images } = await request.json();

    if (!name || !price || !condition || !categoryId || !retailerId) {
      return NextResponse.json(
        { error: 'Required fields: name, price, condition, categoryId, retailerId' },
        { status: 400 }
      );
    }

    console.log('Creating product:', { name, price, condition, categoryId, retailerId });

    const newProduct = await db
      .insert(products)
      .values({
        name,
        description,
        price,
        condition,
        categoryId,
        retailerId,
        images,
      })
      .returning();

    console.log('Product created:', newProduct[0]);

    return NextResponse.json({
      success: true,
      product: newProduct[0]
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
