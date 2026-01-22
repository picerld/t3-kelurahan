"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import type { z } from "zod";
import { Hash, User, Phone, Mail, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { citizenFormSchema } from "../forms/citizen";
import { api } from "@/utils/api";
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
import { DatePickerField } from "@/components/ui/date-picker-field";

type CitizenCreateValues = z.infer<typeof citizenFormSchema>;

export function CitizenCreateForm() {
    const router = useRouter();

    const createCitizen = api.citizen.create.useMutation({
        onSuccess: () => {
            toast.success("Berhasil", { description: "Data penduduk ditambahkan." });
            router.push("/citizens");
            router.refresh();
        },
        onError: (err) => {
            toast.error("Gagal menyimpan", {
                description: err.message ?? "Silakan coba lagi.",
            });
        },
    });

    const isBusy = createCitizen.isPending;

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
        } satisfies CitizenCreateValues,
        validators: { onSubmit: citizenFormSchema },
        onSubmit: async ({ value }) => {
            await createCitizen.mutateAsync({
                ...value,
                email: value.email?.trim() ? value.email.trim() : undefined,
                tempatLahir: value.tempatLahir?.trim() ? value.tempatLahir.trim() : undefined,
                tanggalLahir: value.tanggalLahir?.trim() ? value.tanggalLahir.trim() : undefined,
                alamatId: value.alamatId?.trim() ? value.alamatId.trim() : undefined,
                keluargaId: value.keluargaId?.trim() ? value.keluargaId.trim() : undefined,
                statusDalamKeluarga: value.statusDalamKeluarga ?? value.statusDalamKeluarga,
            });
        },
    });

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await form.handleSubmit();
            }}
            className="mt-6 space-y-6"
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
                                        className="pl-12 h-12"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        disabled={isBusy}
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
                                        className="pl-12 h-12"
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
                                        onValueChange={(value) => field.handleChange(value as "L" | "P")}
                                        disabled={isBusy}
                                    >
                                        <SelectTrigger className={`h-12 rounded-xl ${isInvalid ? "border-destructive" : ""}`}>
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
                                        className="pl-12 h-12"
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
                                            className="pl-12 h-12"
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

                <Separator />

                <form.Field name="alamatId">
                    {(field) => (
                        <AddressSelectField
                            value={field.state.value ?? ""}
                            onChange={(v) => field.handleChange(v)}
                            disabled={isBusy}
                        />
                    )}
                </form.Field>

                <form.Field name="keluargaId">
                    {(field) => (
                        <FamilySelectField
                            value={field.state.value ?? ""}
                            onChange={(v) => field.handleChange(v)}
                            disabled={isBusy}
                            alamatIdToLink={form.getFieldValue("alamatId")}
                        />
                    )}
                </form.Field>

                <form.Field name="statusDalamKeluarga">
                    {(field) => (
                        <FamilyRoleSelectField
                            value={field.state.value ?? ""}
                            onChange={(v) => field.handleChange(v)}
                            disabled={isBusy}
                        />
                    )}
                </form.Field>

                <Field>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-semibold rounded-xl transition-all duration-300"
                        disabled={isBusy}
                    >
                        {createCitizen.isPending ? "Menyimpan..." : "Simpan Data Penduduk"}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}