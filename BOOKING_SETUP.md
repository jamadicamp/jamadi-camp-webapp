# Booking Modal Setup Guide

## Overview
The booking modal provides a complete booking experience with:
- User information form (name, email, phone, special requests)
- Property details display with image and pricing
- Interactive calendar for date selection with **real-time availability checking**
- Real-time price calculation
- EmailJS integration for sending booking requests
- **Automatic date parameter preservation** when navigating from search results

## Required Dependencies

Install the required packages:

```bash
npm install @emailjs/browser @radix-ui/react-dialog
```

## New Features

### ✅ **Availability Checking**
- **Real-time availability validation**: The modal fetches property availability data when opened
- **Visual feedback**: Unavailable dates are crossed out and highlighted in red
- **Smart validation**: Prevents booking if any date in the selected range is unavailable
- **Conflict detection**: Shows warnings when selected dates include unavailable periods

### ✅ **Date Parameter Preservation**
- **Seamless navigation**: Date and guest selections from the main page search are automatically passed to property pages
- **Pre-filled forms**: Booking modal opens with dates and guest count already selected
- **URL parameters**: Dates are preserved in the URL for bookmarking and sharing

### ✅ **Guest Count Integration**
- **Capacity filtering**: Properties are filtered based on guest capacity during search
- **Guest validation**: Booking modal respects property guest limits
- **URL preservation**: Guest count is included in property page URLs

## How It Works

### 1. **Main Page Search Flow**
1. User selects dates and guest count on the main page
2. System filters properties based on availability and capacity
3. User clicks on a property
4. **Dates and guest count are automatically passed via URL parameters**
5. Property page opens with booking modal pre-filled

### 2. **Availability Checking Process**
1. When booking modal opens, it fetches property availability from `/api/properties/{id}/availability`
2. Calendar displays unavailable dates with visual indicators
3. User selection is validated in real-time
4. Form submission is blocked if conflicts are detected

### 3. **URL Parameter Structure**
```
/cabins/{propertyId}?from={checkInDate}&to={checkOutDate}&guests={guestCount}
```

Example:
```
/cabins/507f1f77bcf86cd799439011?from=2024-03-15T00:00:00.000Z&to=2024-03-18T00:00:00.000Z&guests=2
```

## EmailJS Setup

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account

2. **Create Email Service**
   - In your EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions

3. **Create Email Template**
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use the following template structure:

```html
Subject: New Booking Request - {{property_name}}

Dear Team,

You have received a new booking request:

Guest Information:
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}

Property Details:
- Property: {{property_name}} (ID: {{property_id}})
- Check-in: {{check_in}}
- Check-out: {{check_out}}
- Guests: {{guests}}
- Duration: {{nights}} nights
- Estimated Price: {{currency_symbol}}{{estimated_price}}

Special Requests:
{{special_requests}}

Please contact the guest to confirm the booking.

Best regards,
Jamadi Camp Booking System
```

4. **Environment Variables**
   Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_TO_EMAIL=your-email@example.com
```

5. **Enable EmailJS in BookingModal**
   In `src/components/BookingModal.tsx`, uncomment the EmailJS import and replace the console.log with actual email sending:

```typescript
// Uncomment this import
import emailjs from '@emailjs/browser'

// Replace the console.log section with:
await emailjs.send(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  emailData,
  'YOUR_PUBLIC_KEY'
)
```

## Features

### Form Validation
- All required fields must be filled
- Email format validation
- Date validation (check-out must be after check-in)
- **Availability validation (no conflicts with unavailable dates)**
- Guest count within property limits

### Calendar Integration
- Prevents booking past dates
- **Real-time availability checking with visual indicators**
- Auto-adjusts check-out date when check-in changes
- Visual feedback for selected dates
- **Unavailable dates are crossed out and disabled**

### Price Calculation
- Real-time price updates based on selected dates
- Displays total cost and number of nights

### Responsive Design
- Mobile-friendly layout
- Scrollable modal for smaller screens
- Grid layout adapts to screen size

## Usage

The BookingModal component accepts these props:

```typescript
interface BookingModalProps {
  property: Property           // Property data
  initialCheckIn?: Date       // Pre-selected check-in date (from URL params)
  initialCheckOut?: Date      // Pre-selected check-out date (from URL params)
  initialGuests?: number      // Pre-selected guest count (from URL params)
  trigger?: React.ReactNode   // Custom trigger button
}
```

## API Endpoints

### Property Availability
- **GET** `/api/properties/{id}/availability`
  - Returns property's blocked dates and unavailable days
  - Used by booking modal for real-time availability checking

### Availability Calendar
- **GET** `/api/properties/availability-calendar?from={date}&to={date}`
  - Returns overall availability data for date range
  - Used by main page search calendar

## Customization

### Styling
The modal uses Tailwind CSS classes and can be customized by modifying the className props in the component.

### Email Template
Modify the email template in your EmailJS dashboard to match your branding and requirements.

### Form Fields
Add or remove form fields by updating the `BookingFormData` interface and corresponding form elements.

### Availability Rules
Modify availability checking logic in the `isDateUnavailable` and `hasAvailabilityConflict` functions.

## Testing

1. **Test Availability Checking**:
   - Go to CMS → Properties → Manage Availability
   - Mark some dates as unavailable
   - Try to book those dates in the booking modal
   - Verify they are disabled and show warnings

2. **Test Date Parameter Preservation**:
   - Select dates and guests on main page
   - Click on a property
   - Verify booking modal opens with pre-filled dates

3. **Test Form Validation**:
   - Try submitting with incomplete information
   - Try booking unavailable dates
   - Verify appropriate error messages

4. **Test Email Integration** (once configured):
   - Fill out booking form with test data
   - Submit and verify email delivery

## Troubleshooting

### Common Issues
- **Modal not opening**: Check if Dialog component is properly imported
- **Calendar not working**: Ensure date-fns is installed and Calendar component is imported
- **Availability not loading**: Check API endpoint `/api/properties/{id}/availability`
- **Dates not pre-filled**: Verify URL parameters are being passed correctly
- **Email not sending**: Verify EmailJS configuration and environment variables
- **Styling issues**: Check if Tailwind CSS is properly configured

### Debug Mode
The component logs booking data and availability conflicts to console for debugging. Remove these in production after EmailJS is configured.

### Availability API Issues
If availability checking isn't working:
1. Check browser network tab for API calls to `/api/properties/{id}/availability`
2. Verify the property has availability data in the database
3. Check server logs for any API errors 