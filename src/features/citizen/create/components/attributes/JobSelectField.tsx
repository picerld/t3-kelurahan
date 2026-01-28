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

type JobSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function JobSelectField({
  value,
  onChange,
  disabled = false,
}: JobSelectFieldProps) {
  return (
    <Field>
      <FieldLabel className="font-semibold">
        Pekerjaan
      </FieldLabel>

      <Select
        value={value?.trim() ? value : NONE}
        onValueChange={(v) => onChange(v === NONE ? "" : v)}
        disabled={disabled}
      >
        <SelectTrigger className="h-12 rounded-xl">
          <SelectValue placeholder="Pilih pekerjaan" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value={NONE}>(Kosongkan)</SelectItem>
          <SelectItem value="BELUM_TIDAK_BEKERJA">Belum Tidak Bekerja</SelectItem>
          <SelectItem value="PELAJAR_MAHASISWA">Pelajar Mahasiswa</SelectItem>
          <SelectItem value="IRT">IRT</SelectItem>
          <SelectItem value="PNS">PNS</SelectItem>
          <SelectItem value="TNI">TNI</SelectItem>
          <SelectItem value="POLRI">POLRI</SelectItem>
          <SelectItem value="KARYAWAN_SWASTA">Karyawan Swasta</SelectItem>
          <SelectItem value="WIRASWASTA">Wiraswasta</SelectItem>
          <SelectItem value="PETANI">Petani</SelectItem>
          <SelectItem value="NELAYAN">Nelayan</SelectItem>
          <SelectItem value="BURUH">Buruh</SelectItem>
          <SelectItem value="PENSIUNAN">Pensiunan</SelectItem>
          <SelectItem value="LAINNYA">Lainnya</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}