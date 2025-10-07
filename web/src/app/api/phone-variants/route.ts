import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { phoneVariants, phoneModels, phoneBrands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');
    
    console.log('Fetching phone variants...', { modelId });
    
    let query = db
      .select({
        id: phoneVariants.id,
        name: phoneVariants.name,
        modelId: phoneVariants.modelId,
        storage: phoneVariants.storage,
        ram: phoneVariants.ram,
        color: phoneVariants.color,
        price: phoneVariants.price,
        createdAt: phoneVariants.createdAt,
        updatedAt: phoneVariants.updatedAt,
        model: {
          id: phoneModels.id,
          name: phoneModels.name,
          description: phoneModels.description,
          image: phoneModels.image,
          brand: {
            id: phoneBrands.id,
            name: phoneBrands.name,
            description: phoneBrands.description,
            icon: phoneBrands.icon
          }
        }
      })
      .from(phoneVariants)
      .leftJoin(phoneModels, eq(phoneVariants.modelId, phoneModels.id))
      .leftJoin(phoneBrands, eq(phoneModels.brandId, phoneBrands.id));
    
    if (modelId) {
      query = query.where(eq(phoneVariants.modelId, modelId));
    }
    
    const variants = await query.orderBy(phoneVariants.name);

    console.log('Phone variants found:', variants.length);

    return NextResponse.json({
      success: true,
      variants
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
    console.error('Error fetching phone variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone variants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, modelId, storage, ram, color, price } = await request.json();
    
    console.log('Creating phone variant:', { name, modelId, storage, ram, color, price });

    // Clean the name (trim whitespace)
    const cleanName = name.trim();
    
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Variant name is required' },
        { status: 400 }
      );
    }

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // Check if variant already exists for this model (case-insensitive)
    const existingVariants = await db
      .select()
      .from(phoneVariants)
      .where(eq(phoneVariants.modelId, modelId));

    const existingVariant = existingVariants.find((variant: any) => 
      variant.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingVariant) {
      return NextResponse.json(
        { 
          error: `Variant "${existingVariant.name}" already exists for this model. Please choose a different name.`,
          existingVariant: existingVariant
        },
        { status: 409 }
      );
    }

    // Create variant
    const [variant] = await db.insert(phoneVariants).values({
      name: cleanName,
      modelId,
      storage: storage?.trim() || '',
      ram: ram?.trim() || '',
      color: color?.trim() || '',
      price: price || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Phone variant created:', variant.id);

    return NextResponse.json({
      success: true,
      message: 'Phone variant created successfully',
      variant
    });

  } catch (error) {
    console.error('Error creating phone variant:', error);
    
    // Check if it's a unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A variant with this name already exists for this model. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create phone variant' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, storage, ram, color, price, modelId } = await request.json();
    
    console.log('Updating phone variant:', { id, name, storage, ram, color, price, modelId });

    if (!id) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Clean the name (trim whitespace and normalize case)
    const cleanName = name.trim();
    
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Variant name is required' },
        { status: 400 }
      );
    }

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // Check if variant already exists with different ID for this model (case-insensitive)
    const otherVariants = await db
      .select()
      .from(phoneVariants)
      .where(eq(phoneVariants.modelId, modelId));

    const existingVariant = otherVariants.find((variant: any) => 
      variant.id !== id && variant.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingVariant) {
      return NextResponse.json(
        { 
          error: `Variant "${existingVariant.name}" already exists for this model. Please choose a different name.`,
          existingVariant: existingVariant
        },
        { status: 409 }
      );
    }

    // Update variant
    const [updatedVariant] = await db
      .update(phoneVariants)
      .set({
        name: cleanName,
        storage: storage?.trim() || '',
        ram: ram?.trim() || '',
        color: color?.trim() || '',
        price: price || 0,
        modelId: modelId,
        updatedAt: new Date()
      })
      .where(eq(phoneVariants.id, id))
      .returning();

    if (!updatedVariant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    console.log('Phone variant updated:', updatedVariant.id);

    return NextResponse.json({
      success: true,
      message: 'Phone variant updated successfully',
      variant: updatedVariant
    });

  } catch (error) {
    console.error('Error updating phone variant:', error);
    
    return NextResponse.json(
      { error: 'Failed to update phone variant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Deleting phone variant:', { id });

    if (!id) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    // Check if variant exists
    const existingVariant = await db
      .select()
      .from(phoneVariants)
      .where(eq(phoneVariants.id, id))
      .limit(1);

    if (!existingVariant.length) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Delete variant
    await db
      .delete(phoneVariants)
      .where(eq(phoneVariants.id, id));

    console.log('Phone variant deleted:', id);

    return NextResponse.json({
      success: true,
      message: 'Phone variant deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting phone variant:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete phone variant' },
      { status: 500 }
    );
  }
}
