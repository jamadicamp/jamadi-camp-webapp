import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { cookies } from 'next/headers';


async function verifyAuth(request: Request) {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  let token = authHeader?.replace('Bearer ', '');
  
  // If no Authorization header, try cookies
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  }
  
  console.log('Token:', token);
  console.log('Auth header:', authHeader);

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

    const propertyData = await request.json();

    // Validate currencies array if present
    if (propertyData.currencies) {
      if (!Array.isArray(propertyData.currencies)) {
        return NextResponse.json(
          { error: 'currencies must be an array' },
          { status: 400 }
        );
      }

      for (const currency of propertyData.currencies) {
        if (!currency.id || !currency.code || !currency.name || !currency.euro_forex || !currency.symbol) {
          return NextResponse.json(
            { error: 'Each currency must have id, code, name, euro_forex, and symbol' },
            { status: 400 }
          );
        }
      }
    }

    await connectDB();

    const property = await Property.findByIdAndUpdate(
      (await params).id,
      propertyData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(request);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const property = await Property.findByIdAndDelete((await params).id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 