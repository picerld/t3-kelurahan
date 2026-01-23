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

type MaterialSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function MaterialSelectField({
  value,
  onChange,
  disabled = false,
}: MaterialSelectFieldProps) {
  return (
    <Field>
      <FieldLabel className="font-semibold">
        Status Perkawinan
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
          <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
          <SelectItem value="KAWIN">Kawin</SelectItem>
          <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
          <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}