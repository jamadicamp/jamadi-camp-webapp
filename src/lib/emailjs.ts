/* eslint-disable @typescript-eslint/no-explicit-any */
// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/ and create an account
// 2. Create a new service (Gmail, Outlook, etc.)
// 3. Create an email template with the following variables:
//    - {{from_name}}, {{from_email}}, {{phone}}, {{property_name}}, {{property_id}}
//    - {{check_in}}, {{check_out}}, {{guests}}, {{nights}}, {{estimated_price}}, {{currency_symbol}}
//    - {{special_requests}}, {{property_image}}
// 4. Get your Service ID, Template ID, and Public Key
// 5. Replace the values below with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
  TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
  PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY',
  TO_EMAIL: process.env.NEXT_PUBLIC_TO_EMAIL || 'your-email@example.com'
}

// Email template example for EmailJS:
/*
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

Property Image: {{property_image}}

Please contact the guest to confirm the booking.

Best regards,
Jamadi Camp Booking System
*/

export interface BookingEmailData {
  to_email: string
  from_name: string
  from_email: string
  phone: string
  property_name: string
  property_id: string
  check_in: string
  check_out: string
  guests: number
  nights: number
  estimated_price: number
  currency_symbol: string
  special_requests: string
  property_image?: string
}

// Uncomment and use this function when EmailJS is configured

import emailjs from '@emailjs/browser'

export const sendBookingEmail = async (data: BookingEmailData): Promise<void> => {
  try {
    const result = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      data as any as Record<string, unknown>,
      {publicKey: EMAILJS_CONFIG.PUBLIC_KEY}
    )
    console.log(result)
    console.log(data)
    console.log(EMAILJS_CONFIG)
    console.log('Email sent successfully:', result.text)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error('Failed to send booking request')
  }
}