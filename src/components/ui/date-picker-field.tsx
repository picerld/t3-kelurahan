"use client";

import * as React from "react";
import { format, getYear } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

type DatePickerFieldProps = {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
};

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Pilih tanggal",
  disabled = false,
  minYear = 1900,
  maxYear = getYear(new Date()),
}: DatePickerFieldProps) {
  const dateValue = value ? new Date(value) : undefined;

  const [month, setMonth] = React.useState<Date>(
    dateValue ?? new Date(maxYear, 0)
  );

  React.useEffect(() => {
    if (dateValue) setMonth(dateValue);
  }, [value]);

  const years = React.useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) list.push(y);
    return list;
  }, [minYear, maxYear]);

  const months = React.useMemo(
    () => [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    []
  );

  return (
    <Field>
      <FieldLabel className="font-semibold">{label}</FieldLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={`w-full h-12 justify-start rounded-xl pl-12 font-normal ${
              !dateValue ? "text-muted-foreground" : ""
            }`}
          >
            <CalendarDays className="size-5 text-muted-foreground" />
            {dateValue ? (
              format(dateValue, "dd MMM yyyy")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3" align="start">
          <div className="flex gap-2 mb-3">
            <Select
              value={String(month.getMonth())}
              onValueChange={(v) =>
                setMonth(new Date(month.getFullYear(), Number(v)))
              }
            >
              <SelectTrigger className="h-9 w-[140px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(month.getFullYear())}
              onValueChange={(v) =>
                setMonth(new Date(Number(v), month.getMonth()))
              }
            >
              <SelectTrigger className="h-9 w-[100px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]!">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="single"
            selected={dateValue}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              if (!date) {
                onChange("");
                return;
              }

              onChange(format(date, "yyyy-MM-dd"));
            }}
            disabled={(date) =>
              date.getFullYear() < minYear ||
              date.getFullYear() > maxYear ||
              date > new Date()
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
