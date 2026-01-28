"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Hash, User, Phone, Mail, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { citizenFormSchema, type CitizenFormSchema } from "../forms/citizen";
import { api } from "@/utils/api";
import { DatePickerField } from "@/components/ui/date-picker-field";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AddressSelectField } from "./attributes/AddressSelectField";
import { FamilySelectField } from "./attributes/FamilySelectField";
import { FamilyRoleSelectField } from "./attributes/FamilyRoleSelect";
import { ReligionSelectField } from "./attributes/ReligionSelectField";
import { EducationSelectField } from "./attributes/EducationSelectField";
import { MaterialSelectField } from "./attributes/MaterialSelectField";
import { JobSelectField } from "./attributes/JobSelectField";
import type { Citizen } from "@/types/citizen";

type CitizenFormProps = {
  mode: "create" | "edit";
  initialData?: Citizen | null;
};

export function CitizenForm({ mode, initialData }: CitizenFormProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const { mutate: createCitizen, isPending: createCitizenIsPending } = api.citizen.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil", { description: "Data penduduk ditambahkan." });

      utils.citizen.paginate.invalidate();

      form.reset();
    },
    onError: (err) => {
      toast.error("Gagal menyimpan", {
        description: err.message ?? "Silakan coba lagi.",
      });
    },
  });

  const { mutate: updateCitizen, isPending: updateCitizenIsPending } = api.citizen.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil", { description: "Data penduduk diperbarui." });

      utils.citizen.paginate.invalidate();
      utils.citizen.getById.invalidate({ id: initialData?.id });
    },
    onError: (err) => {
      toast.error("Gagal menyimpan", {
        description: err.message ?? "Silakan coba lagi.",
      });
    },
  });

  const isBusy = createCitizenIsPending || updateCitizenIsPending;

  const form = useForm({
    defaultValues: {
      nik: "",
      nama: "",
      jenisKelamin: "" as any,
      tempatLahir: "",
      tanggalLahir: "",
      noHp: "",
      email: "",
      kewarganegaraan: "WNI",
      alamatId: "",
      keluargaId: "",
      statusDalamKeluarga: "" as any,

      agama: "" as any,
      pekerjaan: "" as any,
      pendidikan: "" as any,
      statusPerkawinan: "" as any,
    } satisfies CitizenFormSchema,
    validators: { onSubmit: citizenFormSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        email: value.email?.trim() ? value.email.trim() : undefined,
        tempatLahir: value.tempatLahir?.trim() ? value.tempatLahir.trim() : undefined,
        tanggalLahir: value.tanggalLahir?.trim() ? value.tanggalLahir.trim() : undefined,
        alamatId: value.alamatId?.trim() ? value.alamatId.trim() : undefined,
        keluargaId: value.keluargaId?.trim() ? value.keluargaId.trim() : undefined,
        pekerjaan: value.pekerjaan?.trim() ? value.pekerjaan.trim() : undefined,
      };

      if (mode === "create") {
        createCitizen(payload);
      } else {
        if (!initialData?.id) {
          toast.error("Data tidak ditemukan", { description: "ID citizen tidak tersedia." });
          return;
        }
        updateCitizen({ id: initialData.id, data: payload });
      }
    },
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      form.setFieldValue("nik", initialData.nik);
      form.setFieldValue("nama", initialData.nama);
      form.setFieldValue("jenisKelamin", (initialData.jenisKelamin));
      form.setFieldValue("tempatLahir", initialData.tempatLahir);
      form.setFieldValue(
        "tanggalLahir",
        initialData.tanggalLahir ? new Date(initialData.tanggalLahir).toISOString().slice(0, 10) : "",
      );
      form.setFieldValue("noHp", initialData.noHp);
      form.setFieldValue("email", initialData.email);
      form.setFieldValue("kewarganegaraan", initialData.kewarganegaraan ?? "WNI");
      form.setFieldValue("alamatId", initialData.alamatId);
      form.setFieldValue("keluargaId", initialData.keluargaId);
      form.setFieldValue("statusDalamKeluarga", (initialData.statusDalamKeluarga));

      form.setFieldValue("agama", (initialData.agama));
      form.setFieldValue("pekerjaan", (initialData.pekerjaan));
      form.setFieldValue("pendidikan", (initialData.pendidikan));
      form.setFieldValue("statusPerkawinan", (initialData.statusPerkawinan));
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData]);

  return (
    <div className="pt-10">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
        className="flex h-full flex-col gap-6 py-1 pe-3"
      >
        <FieldGroup>
          <form.Field name="nik">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="font-semibold">Nomor Induk Kependudukan (NIK)</FieldLabel>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                    <Input
                      placeholder="16 digit NIK"
                      className="pl-12 h-12 rounded-xl border-2"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isBusy || mode === "edit"}
                      inputMode="numeric"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="nama">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel className="font-semibold">Nama</FieldLabel>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                    <Input
                      placeholder="Nama lengkap"
                      className="pl-12 h-12 rounded-xl border-2"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isBusy}
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="grid grid-cols-2 gap-5">
            <form.Field name="jenisKelamin">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel className="font-semibold">Jenis Kelamin</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) => field.handleChange(v as "L" | "P")}
                      disabled={isBusy}
                    >
                      <SelectTrigger className={`h-12 rounded-xl border-2 ${isInvalid ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="tanggalLahir">
              {(field) => (
                <DatePickerField
                  label="Tanggal Lahir"
                  value={field.state.value}
                  onChange={field.handleChange}
                  disabled={isBusy}
                  minYear={1900}
                  maxYear={new Date().getFullYear()}
                />
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <form.Field name="noHp">
              {(field) => (
                <Field>
                  <FieldLabel className="font-semibold">No. HP</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                    <Input
                      placeholder="08xxxxxxxxxx"
                      className="pl-12 h-12 rounded-xl border-2"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isBusy}
                    />
                  </div>
                </Field>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel className="font-semibold">Email (opsional)</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        className="pl-12 h-12 rounded-xl border-2"
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isBusy}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <form.Field name="agama">
              {(field) => (
                <ReligionSelectField
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  disabled={isBusy}
                />
              )}
            </form.Field>

            <form.Field name="pendidikan">
              {(field) => (
                <EducationSelectField
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  disabled={isBusy}
                />
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <form.Field name="statusPerkawinan">
              {(field) => (
                <MaterialSelectField
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  disabled={isBusy}
                />
              )}
            </form.Field>

            <form.Field name="pekerjaan">
              {(field) => (
                <JobSelectField
                  value={field.state.value}
                  onChange={(v) => field.handleChange(v)}
                  disabled={isBusy}
                />
              )}
            </form.Field>
          </div>

          <Separator />

          <form.Field name="alamatId">
            {(field) => (
              <AddressSelectField
                value={field.state.value}
                onChange={(v) => field.handleChange(v)}
                disabled={isBusy}
              />
            )}
          </form.Field>

          <form.Field name="keluargaId">
            {(field) => (
              <FamilySelectField
                value={field.state.value}
                onChange={(v) => field.handleChange(v)}
                disabled={isBusy}
                alamatIdToLink={form.getFieldValue("alamatId")}
              />
            )}
          </form.Field>

          <form.Field name="statusDalamKeluarga">
            {(field) => (
              <FamilyRoleSelectField
                value={field.state.value}
                onChange={(v) => field.handleChange(v)}
                disabled={isBusy}
              />
            )}
          </form.Field>
        </FieldGroup>

        <Button type="submit" className="font-medium" disabled={isBusy}>
          {isBusy ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
          {mode === "create" ? "Simpan Data Penduduk" : "Update Data Penduduk"}
        </Button>
      </form>
    </div>
  );
}
