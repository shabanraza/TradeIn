import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isRetailerApproved, businessName, businessAddress, phone, location } = await request.json();
    const retailerId = params.id;

    console.log('Updating retailer:', retailerId, { isRetailerApproved });

    // Update retailer
    const [updatedRetailer] = await db
      .update(users)
      .set({
        isRetailerApproved,
        businessName,
        businessAddress,
        phone,
        location,
        updatedAt: new Date()
      })
      .where(eq(users.id, retailerId))
      .returning();

    if (!updatedRetailer) {
      return NextResponse.json(
        { error: 'Retailer not found' },
        { status: 404 }
      );
    }

    console.log('Retailer updated:', updatedRetailer.id);

    return NextResponse.json({
      success: true,
      message: 'Retailer updated successfully',
      retailer: {
        id: updatedRetailer.id,
        email: updatedRetailer.email,
        name: updatedRetailer.name,
        businessName: updatedRetailer.businessName,
        isRetailerApproved: updatedRetailer.isRetailerApproved
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error updating retailer:', error);
    return NextResponse.json(
      { error: 'Failed to update retailer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const retailerId = params.id;

    console.log('Deleting retailer:', retailerId);

    // Delete retailer
    const [deletedRetailer] = await db
      .delete(users)
      .where(eq(users.id, retailerId))
      .returning();

    if (!deletedRetailer) {
      return NextResponse.json(
        { error: 'Retailer not found' },
        { status: 404 }
      );
    }

    console.log('Retailer deleted:', deletedRetailer.id);

    return NextResponse.json({
      success: true,
      message: 'Retailer deleted successfully'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('Error deleting retailer:', error);
    return NextResponse.json(
      { error: 'Failed to delete retailer' },
      { status: 500 }
    );
  }
}
