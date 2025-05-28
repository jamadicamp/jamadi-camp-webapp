import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { DateRange, UnavailableDay } from '@/app/types/models';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return NextResponse.json(
        { error: 'From and to dates are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find all active properties
    const properties = await Property.find({ is_active: true });

    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    // Create a map of dates to available property count
    const dateAvailabilityMap: Record<string, number> = {};
    
    // Initialize all dates in range with total property count
    const currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateAvailabilityMap[dateStr] = properties.length;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // For each property, subtract from availability count for blocked/unavailable dates
    properties.forEach(property => {
      // Check blocked date ranges
      property.availability.blockedDates?.forEach((blockedDate: DateRange) => {
        const blockedFrom = new Date(blockedDate.from);
        const blockedTo = new Date(blockedDate.to);
        
        const rangeStart = new Date(Math.max(fromDate.getTime(), blockedFrom.getTime()));
        const rangeEnd = new Date(Math.min(toDate.getTime(), blockedTo.getTime()));
        
        if (rangeStart <= rangeEnd) {
          const current = new Date(rangeStart);
          while (current <= rangeEnd) {
            const dateStr = current.toISOString().split('T')[0];
            if (dateAvailabilityMap[dateStr] !== undefined) {
              dateAvailabilityMap[dateStr]--;
            }
            current.setDate(current.getDate() + 1);
          }
        }
      });

      // Check individual unavailable days
      property.availability.unavailableDays?.forEach((unavailableDay: UnavailableDay) => {
        const unavailableDate = new Date(unavailableDay.date);
        if (unavailableDate >= fromDate && unavailableDate <= toDate) {
          const dateStr = unavailableDate.toISOString().split('T')[0];
          if (dateAvailabilityMap[dateStr] !== undefined) {
            dateAvailabilityMap[dateStr]--;
          }
        }
      });
    });

    // Convert to array format with unavailable dates (where count is 0)
    const unavailableDates = Object.entries(dateAvailabilityMap)
      .filter(([, count]) => count === 0)
      .map(([date]) => date);

    return NextResponse.json({
      unavailableDates,
      totalProperties: properties.length,
      dateAvailabilityMap
    });
  } catch (error) {
    console.error('Error fetching availability calendar data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 