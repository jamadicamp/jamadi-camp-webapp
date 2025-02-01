"use client";

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

// Placeholder for your API call
import { getAvailablities } from "../actions";

/* ---------------------------------------------
   Types
--------------------------------------------- */
export type AvailabilityData = {
  property_id: number;
  room_type_id: number;
  period_start: string; // "YYYY-MM-DD"
  period_end: string; // "YYYY-MM-DD"
  available: number;
  total_units: number;
  total_overbooked: number;
  is_available: boolean;
  booking_ids: number[];
  closed_period_id: number | null;
};

export type DayAvailability = {
  availablePropertyIds: Array<{
    property_id: number;
    room_type_id: number;
  }>;
  // More fields if desired
};

/* ---------------------------------------------
   Utility: Convert the raw availability data
   into a record keyed by date (yyyy-mm-dd).
--------------------------------------------- */
export function convertAvailability(
  data: AvailabilityData[]
): Record<string, DayAvailability> {
  const result: Record<string, DayAvailability> = {};

  data.forEach(
    ({ period_start, period_end, property_id, room_type_id, is_available }) => {
      if (!is_available) return; // skip if not available
      const current = new Date(period_start);
      const end = new Date(period_end);
      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        if (!result[dateStr]) {
          result[dateStr] = { availablePropertyIds: [] };
        }
        result[dateStr].availablePropertyIds.push({
          property_id,
          room_type_id,
        });
        current.setDate(current.getDate() + 1);
      }
    }
  );

  return result;
}

/* ---------------------------------------------
   Utility: Merge new dayAvailMap data
   into existing dayAvailMap in state
--------------------------------------------- */
function mergeDayAvailMap(
  base: Record<string, DayAvailability>,
  incoming: Record<string, DayAvailability>
): Record<string, DayAvailability> {
  // For each date in `incoming`, merge it into `base`
  // If base already has that date, we append property IDs
  const merged = { ...base };
  for (const dateStr of Object.keys(incoming)) {
    if (!merged[dateStr]) {
      merged[dateStr] = { ...incoming[dateStr] };
    } else {
      // Merge property IDs
      merged[dateStr].availablePropertyIds.push(
        ...incoming[dateStr].availablePropertyIds
      );
      // (Optionally deduplicate if needed)
      const set = new Set(
        merged[dateStr].availablePropertyIds.map(
          (p) => `${p.property_id}-${p.room_type_id}`
        )
      );
      merged[dateStr].availablePropertyIds = [...set].map((key) => {
        const [property_id, room_type_id] = key.split("-");
        return { property_id: +property_id, room_type_id: +room_type_id };
      });
    }
  }
  return merged;
}

/* ---------------------------------------------
   Utility: Build a list of dates that are
   "fully unavailable" (no properties).
--------------------------------------------- */
function findFullyUnavailableDates(
  from: Date,
  to: Date,
  dayAvailMap: Record<string, DayAvailability>
): Date[] {
  const disabled: Date[] = [];
  const current = new Date(from);
  while (current <= to) {
    const dateStr = current.toISOString().split("T")[0];
    const dayEntry = dayAvailMap[dateStr];
    if (!dayEntry || dayEntry.availablePropertyIds.length === 0) {
      disabled.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return disabled;
}

/* ---------------------------------------------
   Utility: Which properties are available
   for all days in [from, to]?
--------------------------------------------- */
function getPropertiesFullyAvailableAcrossRange(
  dayAvailMap: Record<string, DayAvailability>,
  from: Date,
  to: Date
): Array<{ property_id: number; room_type_id: number }> {
  let intersectionSet: Set<string> | null = null;
  const current = new Date(from);
  while (current <= to) {
    const dateStr = current.toISOString().split("T")[0];
    const dayEntry = dayAvailMap[dateStr];
    if (!dayEntry || dayEntry.availablePropertyIds.length === 0) return [];
    const daySet = new Set(
      dayEntry.availablePropertyIds.map(
        (p) => `${p.property_id}-${p.room_type_id}`
      )
    );
    if (!intersectionSet) {
      intersectionSet = daySet;
    } else {
      intersectionSet = new Set(
        // @ts-expect-error Expected
        [...intersectionSet].filter((id) => daySet.has(id))
      );
      if (intersectionSet.size === 0) return [];
    }
    current.setDate(current.getDate() + 1);
  }

  if (!intersectionSet) return [];
  return [...intersectionSet].map((str) => {
    const [property_id, room_type_id] = str.split("-");
    return { property_id: +property_id, room_type_id: +room_type_id };
  });
}

/* ---------------------------------------------
   Utility: is a given day disabled (past or fully unavailable)?
--------------------------------------------- */
function isDayDisabled(day: Date, disabledDates: Date[]): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 1) Past
  if (day < today) return true;
  // 2) Fully unavailable
  return disabledDates.some((d) => d.toDateString() === day.toDateString());
}

/* ---------------------------------------------
   The main Calendar Component
--------------------------------------------- */
export default function AvailabilityCalendar({
  className,
  onSearch,
}: React.HTMLAttributes<HTMLDivElement> & {
  onSearch: (
    properties: Array<{ property_id: number; room_type_id: number }>,
    date: DateRange
  ) => void;
}) {
  // Track user’s date range
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });

  // We keep track of the loaded date range in state
  const [loadedStart, setLoadedStart] = React.useState<Date>(new Date());
  const [loadedEnd, setLoadedEnd] = React.useState<Date>(
    addDays(new Date(), 2)
  );

  // The in-memory day-based availability
  const [dayAvailMap, setDayAvailMap] = React.useState<
    Record<string, DayAvailability>
  >({});
  // The fully-unavailable (disabled) dates in that map
  const [disabledDates, setDisabledDates] = React.useState<Date[]>([]);
  // The final computed "fully available" properties for the current range
  const [fullyAvailableProperties, setFullyAvailableProperties] =
    React.useState<Array<{ property_id: number; room_type_id: number }>>([]);

  // -------------------------------------------------
  // 1) On mount, fetch the initial [loadedStart, loadedEnd].
  // -------------------------------------------------
  React.useEffect(() => {
    fetchAvailability(loadedStart, loadedEnd);
  }, []);

  // -------------------------------------------------
  // 2) If user picks a date range outside of loaded bounds,
  //    fetch more data to cover that range.
  // -------------------------------------------------
  React.useEffect(() => {
    if (!date?.from || !date?.to) return;

    // if from < loadedStart
    if (date.from < loadedStart) {
      const newStart = new Date(date.from);
      fetchAvailability(newStart, new Date(loadedStart));
      setLoadedStart(newStart);
    }

    // if to > loadedEnd
    if (date.to > loadedEnd) {
      const newEnd = new Date(date.to);
      fetchAvailability(new Date(loadedEnd), newEnd);
      setLoadedEnd(newEnd);
    }
  }, [date?.from, date?.to]);

  // -------------------------------------------------
  // 3) After new data is fetched or date changes,
  //    recompute disabledDates & fullyAvailableProperties
  // -------------------------------------------------
  React.useEffect(() => {
    if (!date?.from || !date?.to) return;

    // Rebuild disabledDates from the entire loaded map in [from, to]
    const newDisabledDates = findFullyUnavailableDates(
      date.from,
      date.to,
      dayAvailMap
    );
    setDisabledDates(newDisabledDates);

    // Recompute which properties are fully available in [from, to]
    const fullyAvail = getPropertiesFullyAvailableAcrossRange(
      dayAvailMap,
      date.from,
      date.to
    );
    setFullyAvailableProperties(fullyAvail);
  }, [dayAvailMap, date]);

  // -------------------------------------------------
  // 4) The function that actually fetches from the server
  //    merges results into the existing dayAvailMap
  // -------------------------------------------------
  async function fetchAvailability(from: Date, to: Date) {
    try {
      // Safety check: if 'from' > 'to', skip
      if (from > to) return;
      console.log(
        "Fetching availability from",
        from.toDateString(),
        "to",
        to.toDateString()
      );

      const response = await getAvailablities(from, to);
      const data = response?.response as AvailabilityData[];

      const newMap = convertAvailability(data);
      // Merge newMap into dayAvailMap
      setDayAvailMap((prev) => mergeDayAvailMap(prev, newMap));
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  }

  // -------------------------------------------------
  // 5) When user manually selects from the calendar
  // -------------------------------------------------
  function handleSelect(newRange: DateRange | undefined) {
    setDate(newRange);
  }

  // -------------------------------------------------
  // 6) The Search callback
  // -------------------------------------------------
  function callbackSearch() {
    if (!date?.from || !date?.to) return;
    console.log("Fully available props:", fullyAvailableProperties);
    onSearch(fullyAvailableProperties, date);
  }

  return (
    <div className="flex flex-row items-center gap-2">
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
              <CalendarIcon className="mr-2 h-4 w-4" />
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
              // Disabling days if they are in the "fully unavailable" list
              // or if they are in the past. For a more robust approach,
              // you could do a single helper function for all logic.
              disabled={(day) => isDayDisabled(day, disabledDates)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Button
          className="bg-yellow-600"
          onClick={callbackSearch}
          disabled={!date?.from || !date?.to}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
