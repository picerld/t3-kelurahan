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

type EducationSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function EducationSelectField({
  value,
  onChange,
  disabled = false,
}: EducationSelectFieldProps) {
  return (
    <Field>
      <FieldLabel className="font-semibold">
        Pendidikan
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
          <SelectItem value="TIDAK_SEKOLAH">Tidak Sekolah</SelectItem>
          <SelectItem value="SD">SD</SelectItem>
          <SelectItem value="SMP">SMP</SelectItem>
          <SelectItem value="SMA">SMA</SelectItem>
          <SelectItem value="D1">D1</SelectItem>
          <SelectItem value="D2">D2</SelectItem>
          <SelectItem value="D3">D3</SelectItem>
          <SelectItem value="S1">S1</SelectItem>
          <SelectItem value="S2">S2</SelectItem>
          <SelectItem value="S3">S3</SelectItem>
          <SelectItem value="LAINNYA">LAINNYA</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}