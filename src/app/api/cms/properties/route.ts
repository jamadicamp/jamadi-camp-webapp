import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';

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

export async function GET(request: Request) {
  console.log('GET request received');
  
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const properties = await Property.find({});
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    console.log('User:', user);

    if (!user || !['admin', 'manager'].includes(user.role as string)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const propertyData = await request.json();
    console.log('Property data:', propertyData);

    // Validate required fields
    const requiredFields = [
      'name',
      'internal_name',
      'description',
      'latitude',
      'longitude',
      'address',
      'zip',
      'city',
      'state',
      'country',
      'images',
      'max_people',
      'bedrooms',
      'bathrooms',
      'area_unit',
      'area'
    ];

    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

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
    const property = await Property.create(propertyData);
    console.log('Created property:', property);
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}