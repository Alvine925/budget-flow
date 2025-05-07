"use client"

import React, { useState, useEffect } from "react" 
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  initialDateRange?: DateRange;
}

export function DatePickerWithRange({
  className,
  initialDateRange
}: DatePickerWithRangeProps) {
  const [date, setDate] = useState<DateRange | undefined>(initialDateRange);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (initialDateRange) {
        // If an initialDateRange prop is provided, ensure the state reflects it.
        // This also handles cases where the prop might change.
        if (date?.from?.getTime() !== initialDateRange.from?.getTime() || date?.to?.getTime() !== initialDateRange.to?.getTime()) {
          setDate(initialDateRange);
        }
      } else if (!date) { 
        // If no initialDateRange prop and date is not yet set (i.e., undefined), set a default.
        setDate({
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          to: addDays(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 0),
        });
      }
    }
  }, [isMounted, initialDateRange, date]); // `date` is included to re-evaluate if it's externally changed to undefined.


  // Render a placeholder or simplified version until mounted, if needed, to ensure server/client initial render matches.
  // However, with `date` initially being `initialDateRange` (or undefined), the text output logic below should be consistent.
  // The key is that `new Date()` for defaults is only called client-side within `useEffect`.

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
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
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
