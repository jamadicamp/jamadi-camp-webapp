'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createProperty(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  // Build currencies array based on checkboxes
  const currencies = [];
  if (formData.get('currency_usd') === 'on') {
    currencies.push({
      id: 1,
      code: 'USD',
      name: 'US Dollar',
      euro_forex: parseFloat(formData.get('usd_forex') as string),
      symbol: '$'
    });
  }
  if (formData.get('currency_mxn') === 'on') {
    currencies.push({
      id: 2,
      code: 'MXN',
      name: 'Mexican Peso',
      euro_forex: parseFloat(formData.get('mxn_forex') as string),
      symbol: 'MX$'
    });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.get('name'),
        internal_name: formData.get('internal_name'),
        description: formData.get('description'),
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
        address: formData.get('address'),
        hide_address: formData.get('hide_address') === 'on',
        zip: formData.get('zip'),
        city: formData.get('city'),
        state: formData.get('state'),
        country: formData.get('country'),
        images: (formData.get('images') as string || '').split(',').filter(url => url.trim()).map(url => ({ url: url.trim() })),
        has_addons: formData.get('has_addons') === 'on',
        rating: parseFloat(formData.get('rating') as string),
        is_active: formData.get('is_active') === 'on',
        currencies: currencies,
        
        // Room fields
        amenities: {
          additionalProp: (formData.get('amenities') as string || '').split(',').filter(amenity => amenity.trim()).map(amenity => ({
            name: amenity.trim(),
            prefix: '',
            bracket: '',
            text: ''
          }))
        },
        breakfast_included: formData.get('breakfast_included') === 'on',
        has_parking: formData.get('has_parking') === 'on',
        adults_only: formData.get('adults_only') === 'on',
        pets_allowed: formData.get('pets_allowed') === 'on',
        show_additional_key_facts: formData.get('show_additional_key_facts') === 'on',
        image_url: formData.get('image_url'),
        max_people: parseInt(formData.get('max_people') as string),
        units: parseInt(formData.get('units') as string),
        has_wifi: formData.get('has_wifi') === 'on',
        has_meal_plan: formData.get('has_meal_plan') === 'on',
        bedrooms: parseInt(formData.get('bedrooms') as string),
        bathrooms: parseInt(formData.get('bathrooms') as string),
        area_unit: formData.get('area_unit'),
        area: parseFloat(formData.get('area') as string)
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create property');
    }

    redirect('/cms');
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

export async function updateProperty(propertyId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  // Build currencies array based on checkboxes
  const currencies = [];
  if (formData.get('currency_usd') === 'on') {
    currencies.push({
      id: 1,
      code: 'USD',
      name: 'US Dollar',
      euro_forex: parseFloat(formData.get('usd_forex') as string),
      symbol: '$'
    });
  }
  if (formData.get('currency_mxn') === 'on') {
    currencies.push({
      id: 2,
      code: 'MXN',
      name: 'Mexican Peso',
      euro_forex: parseFloat(formData.get('mxn_forex') as string),
      symbol: 'MX$'
    });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        units: parseInt(formData.get('units') as string),
        max_people: parseInt(formData.get('max_people') as string),
        is_active: formData.get('is_active') === 'on',
        currencies: currencies
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update property');
    }

    redirect('/cms');
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

export async function updateFullProperty(propertyId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  // Build currencies array based on checkboxes
  const currencies = [];
  if (formData.get('currency_usd') === 'on') {
    currencies.push({
      id: 1,
      code: 'USD',
      name: 'US Dollar',
      euro_forex: parseFloat(formData.get('usd_forex') as string),
      symbol: '$'
    });
  }
  if (formData.get('currency_mxn') === 'on') {
    currencies.push({
      id: 2,
      code: 'MXN',
      name: 'Mexican Peso',
      euro_forex: parseFloat(formData.get('mxn_forex') as string),
      symbol: 'MX$'
    });
  }

  try {
    // Prepare the payload
    const payload = {
      name: formData.get('name'),
      internal_name: formData.get('internal_name'),
      description: formData.get('description'),
      latitude: parseFloat(formData.get('latitude') as string),
      longitude: parseFloat(formData.get('longitude') as string),
      address: formData.get('address'),
      hide_address: formData.get('hide_address') === 'on',
      zip: formData.get('zip'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country'),
      images: (formData.get('images') as string || '').split(',').filter(url => url.trim()).map(url => ({ url: url.trim() })),
      has_addons: formData.get('has_addons') === 'on',
      rating: parseFloat(formData.get('rating') as string) || 0,
      is_active: formData.get('is_active') === 'on',
      currencies: currencies,
      
      // Room fields
      amenities: {
        additionalProp: (formData.get('amenities') as string || '').split(',').filter(amenity => amenity.trim()).map(amenity => ({
          name: amenity.trim(),
          prefix: '',
          bracket: '',
          text: ''
        }))
      },
      breakfast_included: formData.get('breakfast_included') === 'on',
      has_parking: formData.get('has_parking') === 'on',
      adults_only: formData.get('adults_only') === 'on',
      pets_allowed: formData.get('pets_allowed') === 'on',
      show_additional_key_facts: formData.get('show_additional_key_facts') === 'on',
      image_url: formData.get('image_url') || null,
      max_people: parseInt(formData.get('max_people') as string) || 1,
      units: parseInt(formData.get('units') as string) || 1,
      has_wifi: formData.get('has_wifi') === 'on',
      has_meal_plan: formData.get('has_meal_plan') === 'on',
      bedrooms: parseInt(formData.get('bedrooms') as string) || 1,
      bathrooms: parseInt(formData.get('bathrooms') as string) || 1,
      area_unit: formData.get('area_unit') || 'sqm',
      area: parseFloat(formData.get('area') as string) || 0
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cms/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        console.log('Error response text:', errorText);
        
        if (errorText) {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        }
      } catch {
        console.log('Could not parse error response as JSON');
      }
      
      throw new Error(errorMessage);
    }

    // Handle successful response
    const responseText = await response.text();
    console.log('Success response text:', responseText);
    
    if (responseText) {
      try {
        const data = JSON.parse(responseText);
        console.log('Parsed success response:', data);
      } catch {
        console.log('Success response is not JSON, but request succeeded');
      }
    } else {
      console.log('Empty success response (which is okay for updates)');
    }

    redirect('/cms');
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

export async function updatePropertyAvailability(
  propertyId: string, 
  unavailableDays: Array<{
    date: string;
    reason: string;
    description?: string;
    bookingId?: string;
    bookingGuestName?: string;
    bookingContactInfo?: string;
  }>
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/cms/login');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${propertyId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ unavailableDays }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating availability:', error);
    throw error;
  }
}