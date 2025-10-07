import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { leads } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, retailerNotes, estimatedValue } = body;

    console.log('Updating lead:', { id, status, retailerNotes });

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (status) {
      updateData.status = status;
    }

    if (retailerNotes !== undefined) {
      updateData.retailerNotes = retailerNotes;
    }

    if (estimatedValue !== undefined) {
      updateData.estimatedValue = estimatedValue ? parseFloat(estimatedValue.toString()) : null;
    }

    const [updatedLead] = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, id))
      .returning();

    if (!updatedLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    console.log('Lead updated:', updatedLead.id);

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead
    });

  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    console.log('Deleting lead:', { id });

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Check if lead exists
    const existingLead = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (!existingLead.length) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Delete lead
    await db
      .delete(leads)
      .where(eq(leads.id, id));

    console.log('Lead deleted:', id);

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
