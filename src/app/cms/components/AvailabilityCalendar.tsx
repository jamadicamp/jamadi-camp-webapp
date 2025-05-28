'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { UnavailableDay } from '@/app/types/models';
import { CalendarIcon, PlusIcon, EditIcon, TrashIcon } from 'lucide-react';

interface AvailabilityCalendarProps {
  propertyId: string;
}

interface UnavailabilityFormData {
  reason: 'maintenance' | 'booking' | 'owner_use' | 'seasonal_closure' | 'other';
  description: string;
  bookingId?: string;
  bookingGuestName?: string;
  bookingContactInfo?: string;
}

const reasonLabels = {
  maintenance: 'Maintenance',
  booking: 'Booking',
  owner_use: 'Owner Use',
  seasonal_closure: 'Seasonal Closure',
  other: 'Other'
};

const reasonColors = {
  maintenance: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs',
  booking: 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs',
  owner_use: 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs',
  seasonal_closure: 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs',
  other: 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs'
};

export default function AvailabilityCalendar({ propertyId }: AvailabilityCalendarProps) {
  const [unavailableDays, setUnavailableDays] = useState<UnavailableDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UnavailabilityFormData>({
    reason: 'maintenance',
    description: '',
    bookingId: '',
    bookingGuestName: '',
    bookingContactInfo: ''
  });

  // Fetch availability data
  const fetchAvailability = useCallback(async () => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/availability`);
      if (!response.ok) throw new Error('Failed to fetch availability');
      
      const data = await response.json();
      setUnavailableDays(data.unavailableDays || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load availability data');
    }
  }, [propertyId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const existingDay = unavailableDays.find(
      day => new Date(day.date).toDateString() === date.toDateString()
    );

    if (existingDay) {
      // Edit existing unavailable day
      setSelectedDate(date);
      setFormData({
        reason: existingDay.reason,
        description: existingDay.description || '',
        bookingId: existingDay.bookingId || '',
        bookingGuestName: existingDay.bookingGuestName || '',
        bookingContactInfo: existingDay.bookingContactInfo || ''
      });
      setIsEditMode(true);
      setIsDialogOpen(true);
    } else {
      // Add new unavailable day
      setSelectedDate(date);
      setFormData({
        reason: 'maintenance',
        description: '',
        bookingId: '',
        bookingGuestName: '',
        bookingContactInfo: ''
      });
      setIsEditMode(false);
      setIsDialogOpen(true);
    }
  };

  const handleMultiDateSelect = () => {
    if (selectedDates.length === 0) return;
    
    setSelectedDate(undefined);
    setFormData({
      reason: 'maintenance',
      description: '',
      bookingId: '',
      bookingGuestName: '',
      bookingContactInfo: ''
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedDate && selectedDates.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        ...(selectedDate 
          ? { date: selectedDate.toISOString().split('T')[0] }
          : { dates: selectedDates.map(date => date.toISOString().split('T')[0]) }
        )
      };

      const method = isEditMode ? 'PUT' : 'POST';
      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save availability');
      }

      await fetchAvailability();
      setIsDialogOpen(false);
      setSelectedDate(undefined);
      setSelectedDates([]);
    } catch (error) {
      console.error('Error saving availability:', error);
      setError(error instanceof Error ? error.message : 'Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (date: Date) => {
    if (!confirm('Are you sure you want to remove this unavailable day?')) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/properties/${propertyId}/availability?date=${date.toISOString().split('T')[0]}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete availability');
      }

      await fetchAvailability();
    } catch (error) {
      console.error('Error deleting availability:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete availability');
    } finally {
      setLoading(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDays.some(
      day => new Date(day.date).toDateString() === date.toDateString()
    );
  };

  const toggleDateSelection = (date: Date) => {
    setSelectedDates(prev => {
      const isSelected = prev.some(d => d.toDateString() === date.toDateString());
      if (isSelected) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date];
      }
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Availability Calendar</h3>
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              unavailable: (date) => isDateUnavailable(date),
              selected: (date) => selectedDates.some(d => d.toDateString() === date.toDateString())
            }}
            modifiersStyles={{
              unavailable: { backgroundColor: '#fee2e2', color: '#dc2626' },
              selected: { backgroundColor: '#dbeafe', color: '#2563eb' }
            }}
            onDayClick={(date) => {
              if (!isDateUnavailable(date)) {
                toggleDateSelection(date);
              }
            }}
          />
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm">Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm">Selected for bulk action</span>
            </div>
          </div>

          {selectedDates.length > 0 && (
            <div className="mt-4">
              <Button onClick={handleMultiDateSelect} className="w-full">
                <PlusIcon className="h-4 w-4 mr-2" />
                Mark {selectedDates.length} days as unavailable
              </Button>
            </div>
          )}
        </div>

        {/* Unavailable Days List */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Unavailable Days</h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {unavailableDays.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No unavailable days set</p>
            ) : (
              unavailableDays
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {format(new Date(day.date), 'MMM dd, yyyy')}
                        </span>
                        <span className={reasonColors[day.reason]}>
                          {reasonLabels[day.reason]}
                        </span>
                      </div>
                      {day.description && (
                        <p className="text-sm text-gray-600">{day.description}</p>
                      )}
                      {day.bookingGuestName && (
                        <p className="text-sm text-gray-600">Guest: {day.bookingGuestName}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDateSelect(new Date(day.date))}
                      >
                        <EditIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(new Date(day.date))}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {isEditMode 
                ? `Edit Unavailability - ${selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''}`
                : selectedDate 
                  ? `Mark ${format(selectedDate, 'MMM dd, yyyy')} as Unavailable`
                  : `Mark ${selectedDates.length} days as Unavailable`
              }
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value as UnavailabilityFormData['reason'] }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {Object.entries(reasonLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                />
              </div>

              {formData.reason === 'booking' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                    <input
                      type="text"
                      value={formData.bookingId}
                      onChange={(e) => setFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                      placeholder="Booking reference number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                    <input
                      type="text"
                      value={formData.bookingGuestName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bookingGuestName: e.target.value }))}
                      placeholder="Guest name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                    <input
                      type="text"
                      value={formData.bookingContactInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, bookingContactInfo: e.target.value }))}
                      placeholder="Email or phone number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 