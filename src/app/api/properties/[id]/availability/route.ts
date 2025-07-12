import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { UnavailableDay } from '@/app/types/models';

async function verifyAuth(request: Request) {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.replace('Bearer ', '');
  
  // If no Authorization header, try cookies
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// GET - Fetch availability for a property
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const property = await Property.findById((await params).id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      blockedDates: property.availability.blockedDates || [],
      unavailableDays: property.availability.unavailableDays || []
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add unavailable day(s)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('POST request received');
    console.log(await params);
    const user = await verifyAuth(request);
    if (!user || !['admin', 'manager'].includes(user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date, dates, reason, description, bookingId, bookingGuestName, bookingContactInfo } = body;

    if (!reason || !['maintenance', 'booking', 'owner_use', 'seasonal_closure', 'other'].includes(reason)) {
      return NextResponse.json(
        { error: 'Valid reason is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const property = await Property.findById((await params).id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Handle single date or multiple dates
    const datesToAdd = dates || [date];
    if (!datesToAdd || datesToAdd.length === 0) {
      return NextResponse.json(
        { error: 'Date or dates are required' },
        { status: 400 }
      );
    }

    const userId = Buffer.from(Object.values((user.userId as { buffer: number[] }).buffer)).toString('hex');
    const newUnavailableDays: UnavailableDay[] = datesToAdd.map((dateStr: string) => ({
      date: new Date(dateStr),
      reason,
      description: description || '',
      bookingId: bookingId || null,
      bookingGuestName: bookingGuestName || null,
      bookingContactInfo: bookingContactInfo || null,
      createdAt: new Date(),
      createdBy: userId
    }));

    console.log(user, userId, newUnavailableDays)

    // Remove any existing entries for the same dates to avoid duplicates
    property.availability.unavailableDays = property.availability.unavailableDays?.filter(
      (day: UnavailableDay) => !datesToAdd.some((dateStr: string) => 
        new Date(dateStr).toDateString() === new Date(day.date).toDateString()
      )
    );

    // Add new unavailable days
    if (property.availability.unavailableDays) {
      property.availability.unavailableDays.push(...newUnavailableDays);
    } else {
      property.availability.unavailableDays = newUnavailableDays;
    }

    console.log(property.availability.unavailableDays)
    
    await property.save();

    return NextResponse.json({ 
      message: 'Unavailable days added successfully',
      unavailableDays: newUnavailableDays
    });
  } catch (error) {
    console.error('Error adding unavailable days:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update an unavailable day
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'manager'].includes(user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date, reason, description, bookingId, bookingGuestName, bookingContactInfo } = body;

    if (!date || !reason) {
      return NextResponse.json(
        { error: 'Date and reason are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const property = await Property.findById((await params).id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Find and update the specific unavailable day
    const dayIndex = property.availability.unavailableDays.findIndex(
      (day: UnavailableDay) => new Date(day.date).toDateString() === new Date(date).toDateString()
    );

    if (dayIndex === -1) {
      return NextResponse.json(
        { error: 'Unavailable day not found' },
        { status: 404 }
      );
    }

    const day = property.availability.unavailableDays[dayIndex];
    day.reason = reason;
    day.description = description || '';
    day.bookingId = bookingId || null;
    day.bookingGuestName = bookingGuestName || null;
    day.bookingContactInfo = bookingContactInfo || null;

    await property.save();

    return NextResponse.json({ 
      message: 'Unavailable day updated successfully',
      unavailableDay: property.availability.unavailableDays[dayIndex]
    });
  } catch (error) {
    console.error( error);
    return NextResponse.json(
      { error: `Error updating unavailable day: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - Remove unavailable day(s)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || !['admin', 'manager'].includes(user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const dates = searchParams.get('dates')?.split(',');

    const datesToRemove = dates || (date ? [date] : []);
    if (datesToRemove.length === 0) {
      return NextResponse.json(
        { error: 'Date or dates parameter is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const property = await Property.findById((await params).id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Remove the specified dates
    property.availability.unavailableDays = property.availability.unavailableDays.filter(
      (day: UnavailableDay) => !datesToRemove.some((dateStr: string) => 
        new Date(dateStr).toDateString() === new Date(day.date).toDateString()
      )
    );

    await property.save();

    return NextResponse.json({ 
      message: 'Unavailable days removed successfully'
    });
  } catch (error) {
    console.error('Error removing unavailable days:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 