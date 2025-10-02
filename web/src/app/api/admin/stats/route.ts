import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/config';
import { users, phoneBrands, phoneModels, phoneVariants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching admin stats...');

    // Get user counts by role
    const allUsers = await db.select().from(users);
    const customers = allUsers.filter(user => user.role === 'customer');
    const retailers = allUsers.filter(user => user.role === 'retailer');
    const pendingRetailers = retailers.filter(user => !user.isRetailerApproved);
    const activeRetailers = retailers.filter(user => user.isRetailerApproved);

    // Get phone database counts
    const brands = await db.select().from(phoneBrands);
    const models = await db.select().from(phoneModels);
    const variants = await db.select().from(phoneVariants);

    // Get leads counts (using raw SQL since leads table might not be in Drizzle schema yet)
    let leadsStats = {
      total: 0,
      new: 0,
      contacted: 0,
      interested: 0,
      closed: 0,
      rejected: 0
    };

    try {
      const leadsResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/leads`);
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        if (leadsData.success) {
          const leads = leadsData.leads;
          leadsStats = {
            total: leads.length,
            new: leads.filter((lead: any) => lead.status === 'new').length,
            contacted: leads.filter((lead: any) => lead.status === 'contacted').length,
            interested: leads.filter((lead: any) => lead.status === 'interested').length,
            closed: leads.filter((lead: any) => lead.status === 'closed').length,
            rejected: leads.filter((lead: any) => lead.status === 'rejected').length
          };
        }
      }
    } catch (error) {
      console.log('Could not fetch leads stats:', error);
    }

    const stats = {
      users: {
        total: allUsers.length,
        customers: customers.length,
        retailers: retailers.length,
        pendingRetailers: pendingRetailers.length,
        activeRetailers: activeRetailers.length
      },
      phoneDatabase: {
        brands: brands.length,
        models: models.length,
        variants: variants.length
      },
      leads: leadsStats
    };

    console.log('Admin stats:', stats);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
