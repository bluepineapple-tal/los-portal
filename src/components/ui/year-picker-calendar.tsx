"use client";

import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar as BaseCalendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DayPickerSingleProps } from "react-day-picker";

type YearPickerCalendarProps = Omit<DayPickerSingleProps, "initialFocus"> & {
  /** Earliest year in dropdown */
  fromYear?: number;
  /** Latest year in dropdown */
  toYear?: number;
};

export function YearPickerCalendar({
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  month: initialMonth,
  ...props // includes: mode, selected, onSelect, disabled, etc.
}: YearPickerCalendarProps) {
  // manage our own display month so we can sync dropdown and arrows
  const [displayMonth, setDisplayMonth] = useState<Date>(
    initialMonth ?? new Date(),
  );

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => toYear - i,
  );

  return (
    <div className="space-y-2">
      {/* header: year selector + nav arrows */}
      <div className="flex items-center justify-between px-2">
        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={(y) => {
            const dt = new Date(displayMonth);
            dt.setFullYear(Number(y));
            setDisplayMonth(dt);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-1">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setDisplayMonth(subMonths(displayMonth, 1))}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setDisplayMonth(addMonths(displayMonth, 1))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* the underlying single-date calendar */}
      <BaseCalendar
        {...props}
        mode="single"
        month={displayMonth}
        onMonthChange={setDisplayMonth}
        initialFocus
      />
    </div>
  );
}
