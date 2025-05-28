"use client";

import * as React from "react";
import { addDays, format, addMonths } from "date-fns";
import { CalendarIcon, Users } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Property } from "../types/models";

interface MainAvailabilityCalendarProps {
	className?: string;
	onSearch: (properties: Property[], date: DateRange, guests: number) => void;
	allProperties: Property[];
}

interface AvailabilityData {
	unavailableDates: string[];
	totalProperties: number;
	dateAvailabilityMap: Record<string, number>;
}

export default function MainAvailabilityCalendar({
	className,
	onSearch,
	allProperties,
}: MainAvailabilityCalendarProps) {
	// Track user's date range
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: new Date(),
		to: addDays(new Date(), 2),
	});

	// Track guest count
	const [guests, setGuests] = React.useState<number>(1);

	// Track the loaded date range for availability data (2 months by default)
	const [loadedStart, setLoadedStart] = React.useState<Date>(new Date());
	const [loadedEnd, setLoadedEnd] = React.useState<Date>(
		addMonths(new Date(), 2)
	);

	// Availability data
	const [availabilityData, setAvailabilityData] = React.useState<AvailabilityData>({
		unavailableDates: [],
		totalProperties: 0,
		dateAvailabilityMap: {},
	});

	// Loading and error states
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);

	// -------------------------------------------------
	// 1) On mount, fetch the initial 2-month range
	// -------------------------------------------------
	React.useEffect(() => {
		fetchAvailabilityData(loadedStart, loadedEnd);
	}, [loadedStart, loadedEnd]);

	// -------------------------------------------------
	// 2) If user picks a date range outside of loaded bounds,
	//    fetch more data to cover that range.
	// -------------------------------------------------
	React.useEffect(() => {
		if (!date?.from || !date?.to) return;

		let needsNewFetch = false;
		let newStart = new Date(loadedStart);
		let newEnd = new Date(loadedEnd);

		// if from < loadedStart
		if (date.from < loadedStart) {
			newStart = new Date(date.from);
			needsNewFetch = true;
		}

		// if to > loadedEnd
		if (date.to > loadedEnd) {
			newEnd = new Date(date.to);
			needsNewFetch = true;
		}

		if (needsNewFetch) {
			setLoadedStart(newStart);
			setLoadedEnd(newEnd);
		}
	}, [date?.from, date?.to, loadedStart, loadedEnd]);

	// -------------------------------------------------
	// 3) Fetch availability data from the API
	// -------------------------------------------------
	async function fetchAvailabilityData(from: Date, to: Date) {
		if (from > to) return;
		
		setLoading(true);
		setError(null);
		
		try {
			console.log(
				"Fetching availability data from",
				from.toDateString(),
				"to",
				to.toDateString()
			);

			const response = await fetch(
				`/api/properties/availability-calendar?from=${from.toISOString()}&to=${to.toISOString()}`
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch availability data: ${response.status}`);
			}

			const data: AvailabilityData = await response.json();
			setAvailabilityData(data);
		} catch (error) {
			console.error("Error fetching availability data:", error);
			setError(error instanceof Error ? error.message : 'Failed to load availability data');
		} finally {
			setLoading(false);
		}
	}

	// -------------------------------------------------
	// 4) When user manually selects from the calendar
	// -------------------------------------------------
	function handleSelect(newRange: DateRange | undefined) {
		setDate(newRange);
	}

	// -------------------------------------------------
	// 5) Check if a date is unavailable (no properties available)
	// -------------------------------------------------
	function isDateUnavailable(date: Date): boolean {
		const dateStr = date.toISOString().split('T')[0];
		return availabilityData.unavailableDates.includes(dateStr);
	}

	// -------------------------------------------------
	// 6) Check if a date is in the past
	// -------------------------------------------------
	function isDateDisabled(date: Date): boolean {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return date < today;
	}

	// -------------------------------------------------
	// 7) Get available properties for the selected date range and guest count
	// -------------------------------------------------
	function getAvailableProperties(): Property[] {
		if (!date?.from || !date?.to) return [];

		return allProperties.filter(property => {
			const fromDate = new Date(date.from!);
			const toDate = new Date(date.to!);

			// Check guest capacity
			if (property.max_people < guests) {
				return false;
			}

			// Check if any blocked date range overlaps with the requested date range
			const hasBlockedDateConflict = property.availability?.blockedDates?.some((blockedDate) => {
				const blockedFrom = new Date(blockedDate.from);
				const blockedTo = new Date(blockedDate.to);
				
				return (
					(fromDate >= blockedFrom && fromDate <= blockedTo) || // Start date falls within blocked range
					(toDate >= blockedFrom && toDate <= blockedTo) || // End date falls within blocked range
					(fromDate <= blockedFrom && toDate >= blockedTo) // Requested range completely encompasses blocked range
				);
			});

			// Check if any individual unavailable day falls within the requested date range
			const hasUnavailableDayConflict = property.availability?.unavailableDays?.some((unavailableDay) => {
				const unavailableDate = new Date(unavailableDay.date);
				return unavailableDate >= fromDate && unavailableDate <= toDate;
			});

			// Property is available if it has no conflicts with either blocked dates or unavailable days
			return !hasBlockedDateConflict && !hasUnavailableDayConflict;
		});
	}

	// -------------------------------------------------
	// 8) The Search callback
	// -------------------------------------------------
	function handleSearch() {
		if (!date?.from || !date?.to) return;
		
		const availableProperties = getAvailableProperties();
		console.log("Available properties for selected range:", availableProperties);
		onSearch(availableProperties, date, guests);
	}

	return (
		<div className="flex flex-col items-center gap-2">
			{error && (
				<div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2">
					{error}
				</div>
			)}
			
			<div className="flex flex-row items-center gap-2">
				<div className={cn("grid gap-2", className)}>
					<Popover>
						<PopoverTrigger asChild>
							<button
								id="date"
								className={cn(
									"w-[400px] justify-start text-left font-normal flex flex-row gap-1 border p-2 items-center",
									!date && "text-muted-foreground"
								)}
								disabled={loading}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{loading ? (
									<span>Loading availability...</span>
								) : date?.from ? (
									date.to ? (
										<>
											From <b>{format(date.from, "LLL dd, y")}</b> to{" "}
											<b>{format(date.to, "LLL dd, y")}</b>
										</>
									) : (
										format(date.from, "LLL dd, y")
									)
								) : (
									<span>Select Arrival and Departure date</span>
								)}
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={date?.from}
								selected={date}
								onSelect={handleSelect}
								numberOfMonths={2}
								disabled={(day) => isDateDisabled(day)}
								modifiers={{
									unavailable: (day) => isDateUnavailable(day),
								}}
								modifiersStyles={{
									unavailable: { 
										backgroundColor: '#fee2e2', 
										color: '#dc2626',
										textDecoration: 'line-through'
									},
								}}
							/>
							<div className="p-3 border-t">
								<div className="flex items-center gap-2 text-sm">
									<div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
									<span>No properties available</span>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>

				{/* Guest Selection */}
				<div className="flex items-center gap-2 border p-2 rounded">
					<Users className="h-4 w-4" />
					<select
						value={guests}
						onChange={(e) => setGuests(parseInt(e.target.value))}
						className="bg-transparent outline-none"
					>
						{[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
							<option key={num} value={num}>
								{num} {num === 1 ? 'Guest' : 'Guests'}
							</option>
						))}
					</select>
				</div>

				<div>
					<button
						className="p-2 px-4 border bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={handleSearch}
						disabled={!date?.from || !date?.to || loading}
					>
						{loading ? 'Loading...' : 'Search'}
					</button>
				</div>
			</div>
		</div>
	);
} 