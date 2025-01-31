"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getAvailablities } from "../actions";

type AvailabilityData = {
  property_id: number;
  room_type_id: number;
  period_start: string;
  period_end: string;
  available: number;
  total_units: number;
  total_overbooked: number;
  is_available: boolean;
  booking_ids: number[];
  closed_period_id: number | null;
};

type ProcessedAvailability = {
  available_properties: number;
  unavailable_properties: number;
  total_units: number;
  properties: { property_id: number; room_type_id: number }[];
};

function convertAvailability(
  data: AvailabilityData[]
): Record<string, ProcessedAvailability> {
  const result: Record<string, ProcessedAvailability> = {};

  data.forEach(
    ({
      period_start,
      period_end,
      property_id,
      room_type_id,
      is_available,
      total_units,
    }) => {
      const currentDate = new Date(period_start);
      const endDate = new Date(period_end);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        if (!result[dateStr]) {
          result[dateStr] = {
            available_properties: 0,
            unavailable_properties: 0,
            total_units: 0,
            properties: [],
          };
        }

        if (is_available) {
          result[dateStr].available_properties += 1;
        } else {
          result[dateStr].unavailable_properties += 1;
        }
        result[dateStr].total_units += total_units;
        result[dateStr].properties.push({ property_id, room_type_id });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  );

  return result;
}

function includesDisabledDays(from: Date, to: Date, disabledDates: Date[]) {
  const current = new Date(from);
  while (current <= to) {
    if (
      disabledDates.some(
        (disabledDate) => disabledDate.toDateString() === current.toDateString()
      )
    ) {
      return true;
    }
    current.setDate(current.getDate() + 1);
  }
  return false;
}

export default function AvailabilityCalendar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });

  const [disabledDates, setDisabledDates] = React.useState<Date[]>([]);

  // Fetch availability when component mounts or date changes
  React.useEffect(() => {
    const fetchAvailability = async () => {
      if (!date) return;
      const response = await getAvailablities(date.from as Date, date.to as Date);
      const data = response?.response as AvailabilityData[];

      const processed = convertAvailability(data);
      console.log(processed);

      // Extract dates where there are no available properties
      const unavailableDates = Object.entries(processed)
        .filter(([, value]) => value.available_properties === 0)
        .map(([dateStr]) => new Date(dateStr));

      setDisabledDates(unavailableDates);
    };

    fetchAvailability();
  }, [date]);

  function handleSelect(newRange: DateRange | undefined) {
    // If user hasn't chosen a complete range yet, just set the partial selection
    if (!newRange?.from || !newRange?.to) {
      setDate(newRange);
      return;
    }
    // Check if range includes any disabled days
    const { from, to } = newRange;
    if (includesDisabledDays(from, to, disabledDates)) {
      alert("You cannot select dates overlapping unavailable days.");
      return; // Don't update state
    }
    setDate(newRange);
  }

  return (
    <div>
      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              // This disallows clicking on fully disabled days
              disabled={(day) =>
                disabledDates.some(
                  (disabledDate) =>
                    disabledDate.toDateString() === day.toDateString()
                )
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
