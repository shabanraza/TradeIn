import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { leads } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const retailerId = searchParams.get('retailerId');
    const status = searchParams.get('status');
    
    console.log('Fetching leads...', { retailerId, status });

    let query = db.select().from(leads);

    if (retailerId) {
      query = query.where(eq(leads.retailerId, retailerId));
    }

    if (status) {
      query = query.where(eq(leads.status, status));
    }

    const leadsList = await query.orderBy(desc(leads.createdAt));

    console.log('Leads found:', leadsList.length);

    return NextResponse.json({
      success: true,
      leads: leadsList
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      retailerId,
      phoneBrand,
      phoneModel,
      phoneVariant,
      condition,
      storage,
      color,
      purchaseDate,
      warrantyStatus,
      accessories,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      preferredContactMethod,
      preferredContactTime,
      estimatedValue,
      notes
    } = body;

    console.log('Creating lead:', { customerId, retailerId, phoneBrand, phoneModel });

    // Validate required fields
    if (!customerId || !retailerId || !phoneBrand || !phoneModel || !condition || !customerName || !customerEmail || !customerPhone || !customerLocation || !preferredContactMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [lead] = await db.insert(leads).values({
      customerId,
      retailerId,
      phoneBrand,
      phoneModel,
      phoneVariant,
      condition,
      storage,
      color,
      purchaseDate,
      warrantyStatus,
      accessories,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation,
      preferredContactMethod,
      preferredContactTime,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue.toString()) : null,
      notes,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Lead created:', lead.id);

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      lead
    });

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
