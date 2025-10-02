import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { phoneModels, phoneBrands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    
    console.log('Fetching phone models...', { brandId });
    
    let query = db
      .select({
        id: phoneModels.id,
        name: phoneModels.name,
        brandId: phoneModels.brandId,
        description: phoneModels.description,
        image: phoneModels.image,
        createdAt: phoneModels.createdAt,
        updatedAt: phoneModels.updatedAt,
        brand: {
          id: phoneBrands.id,
          name: phoneBrands.name,
          description: phoneBrands.description,
          icon: phoneBrands.icon
        }
      })
      .from(phoneModels)
      .leftJoin(phoneBrands, eq(phoneModels.brandId, phoneBrands.id));
    
    if (brandId) {
      query = query.where(eq(phoneModels.brandId, brandId));
    }
    
    const models = await query.orderBy(phoneModels.name);

    console.log('Phone models found:', models.length);

    return NextResponse.json({
      success: true,
      models
    });

  } catch (error) {
    console.error('Error fetching phone models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone models' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, brandId, description, image } = await request.json();
    
    console.log('Creating phone model:', { name, brandId });

    // Clean the name (trim whitespace)
    const cleanName = name.trim();
    
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      );
    }

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // Check if model already exists for this brand (case-insensitive)
    const existingModels = await db
      .select()
      .from(phoneModels)
      .where(eq(phoneModels.brandId, brandId));

    const existingModel = existingModels.find((model: any) => 
      model.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingModel) {
      return NextResponse.json(
        { 
          error: `Model "${existingModel.name}" already exists for this brand. Please choose a different name.`,
          existingModel: existingModel
        },
        { status: 409 }
      );
    }

    // Create model
    const [model] = await db.insert(phoneModels).values({
      name: cleanName,
      brandId,
      description: description?.trim() || '',
      image: image?.trim() || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Phone model created:', model.id);

    return NextResponse.json({
      success: true,
      message: 'Phone model created successfully',
      model
    });

  } catch (error) {
    console.error('Error creating phone model:', error);
    
    // Check if it's a unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'A model with this name already exists for this brand. Please choose a different name.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create phone model' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, image, brandId } = await request.json();
    
    console.log('Updating phone model:', { id, name, description, brandId });

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // Clean the name (trim whitespace and normalize case)
    const cleanName = name.trim();
    
    if (!cleanName) {
      return NextResponse.json(
        { error: 'Model name is required' },
        { status: 400 }
      );
    }

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    // Check if model already exists with different ID for this brand (case-insensitive)
    const otherModels = await db
      .select()
      .from(phoneModels)
      .where(eq(phoneModels.brandId, brandId));

    const existingModel = otherModels.find((model: any) => 
      model.id !== id && model.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existingModel) {
      return NextResponse.json(
        { 
          error: `Model "${existingModel.name}" already exists for this brand. Please choose a different name.`,
          existingModel: existingModel
        },
        { status: 409 }
      );
    }

    // Update model
    const [updatedModel] = await db
      .update(phoneModels)
      .set({
        name: cleanName,
        description: description?.trim() || '',
        image: image?.trim() || '',
        brandId: brandId,
        updatedAt: new Date()
      })
      .where(eq(phoneModels.id, id))
      .returning();

    if (!updatedModel) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    console.log('Phone model updated:', updatedModel.id);

    return NextResponse.json({
      success: true,
      message: 'Phone model updated successfully',
      model: updatedModel
    });

  } catch (error) {
    console.error('Error updating phone model:', error);
    
    return NextResponse.json(
      { error: 'Failed to update phone model' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('Deleting phone model:', { id });

    if (!id) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    // Check if model exists
    const existingModel = await db
      .select()
      .from(phoneModels)
      .where(eq(phoneModels.id, id))
      .limit(1);

    if (!existingModel.length) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Delete model
    await db
      .delete(phoneModels)
      .where(eq(phoneModels.id, id));

    console.log('Phone model deleted:', id);

    return NextResponse.json({
      success: true,
      message: 'Phone model deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting phone model:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete phone model' },
      { status: 500 }
    );
  }
}
