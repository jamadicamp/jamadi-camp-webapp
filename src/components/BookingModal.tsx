/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Mail, Phone, User } from "lucide-react"
import Image from "next/image"
import { format, differenceInDays, addDays } from "date-fns"
import { sendBookingEmail } from "@/lib/emailjs"

// You'll need to install @emailjs/browser: npm install @emailjs/browser
// import emailjs from '@emailjs/browser'

interface Property {
  id: string
  name: string
  image_url?: string
  images?: Array<{ url: string }>
  currencies: Array<{
    symbol: string
    euro_forex: number
  }>
  max_people: number
  bedrooms: number
  bathrooms: number
}

interface BookingModalProps {
  property: Property
  initialCheckIn?: Date
  initialCheckOut?: Date
  initialGuests?: number
  trigger?: React.ReactNode
}

interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  checkIn: Date | undefined
  checkOut: Date | undefined
  guests: number
  specialRequests: string
}

interface UnavailableDay {
  date: string
  reason: string
  description?: string
  bookingId?: string
  bookingGuestName?: string
  bookingContactInfo?: string
}

interface DateRange {
  from: Date
  to: Date
}

interface PropertyAvailability {
  blockedDates: DateRange[]
  unavailableDays: UnavailableDay[]
}

export function BookingModal({
  property,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 1,
  trigger
}: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availability, setAvailability] = useState<PropertyAvailability>({ blockedDates: [], unavailableDays: [] })
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
    specialRequests: ""
  })

  // Fetch availability data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailability()
    }
  }, [isOpen, property.id])

  const fetchAvailability = async () => {
    setLoadingAvailability(true)
    try {
      const response = await fetch(`/api/properties/${property.id}/availability`)
      if (response.ok) {
        const data = await response.json()
        setAvailability(data)
      } else {
        console.error('Failed to fetch availability')
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoadingAvailability(false)
    }
  }

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    // Check blocked date ranges
    const isInBlockedRange = availability.blockedDates.some((blockedDate) => {
      const blockedFrom = new Date(blockedDate.from)
      const blockedTo = new Date(blockedDate.to)
      return date >= blockedFrom && date <= blockedTo
    })

    // Check individual unavailable days
    const isUnavailableDay = availability.unavailableDays.some((unavailableDay) => {
      const unavailableDate = new Date(unavailableDay.date)
      return date.toDateString() === unavailableDate.toDateString()
    })

    return isInBlockedRange || isUnavailableDay
  }

  // Check if the selected date range conflicts with availability
  const hasAvailabilityConflict = (): boolean => {
    if (!formData.checkIn || !formData.checkOut) return false

    const current = new Date(formData.checkIn)
    while (current < formData.checkOut) {
      if (isDateUnavailable(current)) {
        return true
      }
      current.setDate(current.getDate() + 1)
    }
    return false
  }

  // Calculate estimated price
  const calculatePrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const nights = differenceInDays(formData.checkOut, formData.checkIn)
    const pricePerNight = property.currencies[0]?.euro_forex || 0
    return nights * pricePerNight
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for availability conflicts before submitting
    if (hasAvailabilityConflict()) {
      alert("Algunas fechas en tu rango seleccionado no están disponibles. Por favor elige fechas diferentes.")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare email data
      const emailData = {
        to_email: process.env.NEXT_PUBLIC_TO_EMAIL as string, // Replace with your email
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        property_name: property.name,
        property_id: property.id,
        check_in: formData.checkIn ? format(formData.checkIn, "PPP") : "",
        check_out: formData.checkOut ? format(formData.checkOut, "PPP") : "",
        guests: formData.guests,
        nights: formData.checkIn && formData.checkOut ? 
          differenceInDays(formData.checkOut, formData.checkIn) : 0,
        estimated_price: calculatePrice(),
        currency_symbol: property.currencies[0]?.symbol || "€",
        special_requests: formData.specialRequests,
        property_image: property.images?.[0]?.url || property.image_url
      }

      // EmailJS configuration - you need to set these up in your EmailJS account
      await sendBookingEmail(emailData)

      // For now, just log the data (remove this when EmailJS is configured)
      console.log("Booking request:", emailData)
      
      alert("¡Solicitud de reservación enviada exitosamente! Te contactaremos pronto.")
      setIsOpen(false)
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        checkIn: undefined,
        checkOut: undefined,
        guests: initialGuests,
        specialRequests: ""
      })
    } catch (error) {
      console.error("Error sending booking request:", error)
      alert("Error al enviar la solicitud de reservación. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.checkIn &&
      formData.checkOut &&
      formData.guests > 0 &&
      formData.checkOut > formData.checkIn &&
      !hasAvailabilityConflict()
    )
  }

  const defaultTrigger = (
    <Button 
      className="bg-orange-50 text-black px-6 py-2 border border-[#3a383a] uppercase transition-colors hover:bg-orange-100"
    >
      Reservar Ahora
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Reserva tu Estadía</DialogTitle>
          <DialogDescription>
            Completa tu reservación para {property.name}
          </DialogDescription>
        </DialogHeader>

        {loadingAvailability && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Cargando disponibilidad...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Summary */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={property.images?.[0]?.url || property.image_url || "/placeholder.jpg"}
                  alt={property.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{property.name}</h3>
                <p className="text-sm text-gray-600">
                  Hasta {property.max_people} huéspedes • {property.bedrooms} habitación(es) • {property.bathrooms} baño(s)
                </p>
                <p className="text-lg font-semibold mt-2">
                  {property.currencies[0]?.symbol}{property.currencies[0]?.euro_forex} / noche
                </p>
                {formData.checkIn && formData.checkOut && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-600">
                      Total: {property.currencies[0]?.symbol}{calculatePrice()} 
                      ({differenceInDays(formData.checkOut, formData.checkIn)} noches)
                    </p>
                    {hasAvailabilityConflict() && (
                      <p className="text-sm font-medium text-red-600 mt-1">
                        ⚠️ Algunas fechas en este rango no están disponibles
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Información del Huésped
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Número de Teléfono *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="guests">Número de Huéspedes *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={property.max_people}
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialRequests">Solicitudes Especiales</Label>
                <textarea
                  id="specialRequests"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Cualquier solicitud especial o requisito..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                />
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Seleccionar Fechas
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Fecha de Llegada *</Label>
                  <Calendar
                    mode="single"
                    selected={formData.checkIn}
                    onSelect={(date) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        checkIn: date,
                        // Auto-set checkout to next day if not set or if it's before check-in
                        checkOut: !prev.checkOut || (date && prev.checkOut <= date) 
                          ? date ? addDays(date, 1) : undefined 
                          : prev.checkOut
                      }))
                    }}
                    disabled={(date) => 
                      date < new Date() || 
                      isDateUnavailable(date)
                    }
                    modifiers={{
                      unavailable: (date) => isDateUnavailable(date),
                    }}
                    modifiersStyles={{
                      unavailable: { 
                        backgroundColor: '#fee2e2', 
                        color: '#dc2626',
                        textDecoration: 'line-through'
                      },
                    }}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  <Label>Fecha de Salida *</Label>
                  <Calendar
                    mode="single"
                    selected={formData.checkOut}
                    onSelect={(date) => setFormData(prev => ({ ...prev, checkOut: date }))}
                    disabled={(date) => 
                      date < new Date() || 
                      (formData.checkIn ? date <= formData.checkIn : false) ||
                      isDateUnavailable(date)
                    }
                    modifiers={{
                      unavailable: (date) => isDateUnavailable(date),
                    }}
                    modifiersStyles={{
                      unavailable: { 
                        backgroundColor: '#fee2e2', 
                        color: '#dc2626',
                        textDecoration: 'line-through'
                      },
                    }}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {formData.checkIn && formData.checkOut && (
                <div className={`p-3 rounded-lg ${hasAvailabilityConflict() ? 'bg-red-50 border border-red-200' : 'bg-green-50'}`}>
                  <p className="text-sm font-medium">
                    <strong>Llegada:</strong> {format(formData.checkIn, "PPP")}
                  </p>
                  <p className="text-sm font-medium">
                    <strong>Salida:</strong> {format(formData.checkOut, "PPP")}
                  </p>
                  <p className="text-sm font-medium">
                    <strong>Duración:</strong> {differenceInDays(formData.checkOut, formData.checkIn)} noches
                  </p>
                  {hasAvailabilityConflict() && (
                    <p className="text-sm font-medium text-red-600 mt-2">
                      ⚠️ Este rango de fechas incluye fechas no disponibles. Por favor selecciona fechas diferentes.
                    </p>
                  )}
                </div>
              )}

              {/* Availability Legend */}
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span>Fechas no disponibles</span>
                </div>
                <p>Las fechas no disponibles están tachadas y no se pueden seleccionar.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting || loadingAvailability}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitud de Reservación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 