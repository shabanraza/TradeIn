import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { leads, users } from '@/lib/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { getBestMatchingRetailer } from '@/lib/utils/location-matcher';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const retailerId = searchParams.get('retailerId');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    
    console.log('Fetching leads...', { retailerId, customerId, status });

    // Use basic query with only existing columns
    let query = db.select({
      id: leads.id,
      customerId: leads.customerId,
      retailerId: leads.retailerId,
      phoneBrand: leads.phoneBrand,
      phoneModel: leads.phoneModel,
      phoneVariant: leads.phoneVariant,
      condition: leads.condition,
      storage: leads.storage,
      color: leads.color,
      purchaseDate: leads.purchaseDate,
      warrantyStatus: leads.warrantyStatus,
      accessories: leads.accessories,
      customerName: leads.customerName,
      customerEmail: leads.customerEmail,
      customerPhone: leads.customerPhone,
      customerLocation: leads.customerLocation,
      preferredContactMethod: leads.preferredContactMethod,
      preferredContactTime: leads.preferredContactTime,
      estimatedValue: leads.estimatedValue,
      status: leads.status,
      notes: leads.notes,
      retailerNotes: leads.retailerNotes,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt
    }).from(leads);

    if (retailerId) {
      query = query.where(eq(leads.retailerId, retailerId));
    }

    if (customerId) {
      query = query.where(eq(leads.customerId, customerId));
    }

    if (status) {
      query = query.where(eq(leads.status, status));
    }

    // Use basic query with existing columns and provide defaults for missing ones
    const leadsList = await query.orderBy(desc(leads.createdAt));

    console.log('Leads found:', leadsList.length);

    // Clean up the response to remove empty/null values and avoid showing "N/A"
    const leadsWithDefaults = leadsList.map((lead: any) => {
      const cleanedLead: any = { ...lead };
      
      // Remove or clean up empty/null values to avoid showing "N/A"
      Object.keys(cleanedLead).forEach(key => {
        if (cleanedLead[key] === null || cleanedLead[key] === '' || cleanedLead[key] === undefined) {
          // Only keep essential fields, remove empty optional fields
          if (!['id', 'customerId', 'retailerId', 'phoneBrand', 'customerName', 'customerPhone', 'customerLocation', 'status', 'createdAt', 'updatedAt'].includes(key)) {
            delete cleanedLead[key];
          }
        }
      });
      
      // Add default values for new form fields only if they have actual values
      if (cleanedLead.phoneAge && cleanedLead.phoneAge !== '') {
        // Keep phoneAge if it has a value
      } else {
        delete cleanedLead.phoneAge;
      }
      
      if (cleanedLead.hasBill !== undefined) {
        // Keep hasBill if it has a value
      } else {
        delete cleanedLead.hasBill;
      }
      
      if (cleanedLead.billImage && cleanedLead.billImage !== '') {
        // Keep billImage if it has a value
      } else {
        delete cleanedLead.billImage;
      }
      
      if (cleanedLead.hasBox !== undefined) {
        // Keep hasBox if it has a value
      } else {
        delete cleanedLead.hasBox;
      }
      
      if (cleanedLead.screenReplacement && cleanedLead.screenReplacement !== '') {
        // Keep screenReplacement if it has a value
      } else {
        delete cleanedLead.screenReplacement;
      }
      
      if (cleanedLead.batteryPercentage && cleanedLead.batteryPercentage !== '') {
        // Keep batteryPercentage if it has a value
      } else {
        delete cleanedLead.batteryPercentage;
      }
      
      return cleanedLead;
    });

    return NextResponse.json({
      success: true,
      leads: leadsWithDefaults
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
      notes,
      // New fields
      phoneAge,
      hasBill,
      billImage,
      hasBox,
      screenReplacement,
      batteryPercentage
    } = body;

    console.log('Creating lead:', { customerId, phoneBrand, phoneModel });

    // Validate only truly required fields
    if (!customerId || !phoneBrand || !customerName || !customerPhone || !customerLocation) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, phoneBrand, customerName, customerPhone, customerLocation' },
        { status: 400 }
      );
    }

    // Auto-assign retailer based on location if not provided
    let assignedRetailerId = retailerId;
    if (!assignedRetailerId && customerLocation) {
      try {
        // Get all approved retailers
        const allRetailers = await db
          .select({
            id: users.id,
            businessName: users.businessName,
            location: users.location,
            isRetailerApproved: users.isRetailerApproved
          })
          .from(users)
          .where(
            and(
              eq(users.role, 'retailer'),
              eq(users.isRetailerApproved, true)
            )
          );

        // Find best matching retailer
        const bestRetailer = getBestMatchingRetailer(customerLocation, allRetailers);
        if (bestRetailer) {
          assignedRetailerId = bestRetailer.id;
          console.log('Auto-assigned retailer:', bestRetailer.businessName, 'for location:', customerLocation);
        } else {
          console.log('No matching retailer found for location:', customerLocation);
        }
      } catch (error) {
        console.error('Error finding matching retailer:', error);
        // Continue without auto-assignment if there's an error
      }
    }

    const [lead] = await db.insert(leads).values({
      customerId,
      retailerId: assignedRetailerId || null,
      phoneBrand,
      phoneModel: phoneModel || '',
      phoneVariant: phoneVariant || null,
      condition: condition || 'good',
      storage: storage || null,
      color: color || null,
      purchaseDate: purchaseDate || null,
      warrantyStatus: warrantyStatus || null,
      accessories: accessories || null,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      customerLocation,
      preferredContactMethod: preferredContactMethod || 'phone',
      preferredContactTime: preferredContactTime || null,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue.toString()) : null,
      notes: notes || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    console.log('Lead created:', lead.id);

    // Get retailer info if auto-assigned
    let retailerInfo = null;
    if (assignedRetailerId && assignedRetailerId !== retailerId) {
      try {
        const retailer = await db
          .select({
            id: users.id,
            businessName: users.businessName,
            location: users.location
          })
          .from(users)
          .where(eq(users.id, assignedRetailerId))
          .limit(1);
        
        if (retailer.length > 0) {
          retailerInfo = retailer[0];
        }
      } catch (error) {
        console.error('Error fetching retailer info:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      lead,
      autoAssignedRetailer: retailerInfo
    });

  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
