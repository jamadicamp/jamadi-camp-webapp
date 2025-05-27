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

    // Find all properties
    const properties = await Property.find({});

    // Filter properties that are available for the given date range
    const availableProperties = properties.filter(property => {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // Check if any blocked date range overlaps with the requested date range
      const hasBlockedDateConflict = property.availability.blockedDates.some((blockedDate: DateRange) => {
        const blockedFrom = new Date(blockedDate.from);
        const blockedTo = new Date(blockedDate.to);
        
        return (
          (fromDate >= blockedFrom && fromDate <= blockedTo) || // Start date falls within blocked range
          (toDate >= blockedFrom && toDate <= blockedTo) || // End date falls within blocked range
          (fromDate <= blockedFrom && toDate >= blockedTo) // Requested range completely encompasses blocked range
        );
      });

      // Check if any individual unavailable day falls within the requested date range
      const hasUnavailableDayConflict = property.availability.unavailableDays?.some((unavailableDay: UnavailableDay) => {
        const unavailableDate = new Date(unavailableDay.date);
        return unavailableDate >= fromDate && unavailableDate <= toDate;
      });

      // Property is available if it has no conflicts with either blocked dates or unavailable days
      return !hasBlockedDateConflict && !hasUnavailableDayConflict;
    });

    return NextResponse.json(availableProperties);
  } catch (error) {
    console.error('Error fetching available properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 