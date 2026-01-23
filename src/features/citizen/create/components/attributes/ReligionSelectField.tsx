"use client";

import * as React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const NONE = "__none__";

type ReligionSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ReligionSelectField({
  value,
  onChange,
  disabled = false,
}: ReligionSelectFieldProps) {
  return (
    <Field>
      <FieldLabel className="font-semibold">
        Agama
      </FieldLabel>

      <Select
        value={value?.trim() ? value : NONE}
        onValueChange={(v) => onChange(v === NONE ? "" : v)}
        disabled={disabled}
      >
        <SelectTrigger className="h-12 rounded-xl">
          <SelectValue placeholder="Pilih status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={NONE}>(Kosongkan)</SelectItem>
          <SelectItem value="ISLAM">Islam</SelectItem>
          <SelectItem value="KRISTEN">Kristen</SelectItem>
          <SelectItem value="KATOLIK">Katolik</SelectItem>
          <SelectItem value="HINDU">Hindu</SelectItem>
          <SelectItem value="BUDDHA">Buddha</SelectItem>
          <SelectItem value="KONGHUCU">Konghucu</SelectItem>
          <SelectItem value="LAINNYA">Lainnya</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}