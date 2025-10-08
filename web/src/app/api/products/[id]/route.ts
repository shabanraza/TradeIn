import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { products, categories, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    
    console.log('Fetching product:', productId);

    const product = await db
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
          location: users.location,
          email: users.email,
          phone: users.phone
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(users, eq(products.retailerId, users.id))
      .where(eq(products.id, productId))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('Product found:', product[0].name);

    return NextResponse.json({
      success: true,
      product: product[0]
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
