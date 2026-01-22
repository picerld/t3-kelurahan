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

type FamilyRoleSelectFieldProps = {
  value: string;               // statusDalamKeluarga ("" if none)
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function FamilyRoleSelectField({
  value,
  onChange,
  disabled = false,
}: FamilyRoleSelectFieldProps) {
  return (
    <Field>
      <FieldLabel className="font-semibold">
        Status Dalam Keluarga (opsional)
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
          <SelectItem value="KEPALA_KELUARGA">Kepala Keluarga</SelectItem>
          <SelectItem value="SUAMI">Suami</SelectItem>
          <SelectItem value="ISTRI">Istri</SelectItem>
          <SelectItem value="ANAK">Anak</SelectItem>
          <SelectItem value="MENANTU">Menantu</SelectItem>
          <SelectItem value="CUCU">Cucu</SelectItem>
          <SelectItem value="ORANG_TUA">Orang Tua</SelectItem>
          <SelectItem value="MERTUA">Mertua</SelectItem>
          <SelectItem value="FAMILI_LAIN">Famili Lain</SelectItem>
          <SelectItem value="PEMBANTU">Pembantu</SelectItem>
          <SelectItem value="LAINNYA">Lainnya</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}