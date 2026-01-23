import { z } from "zod";

export const citizenFormSchema = z.object({
    id: z.string().optional(),
    nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
    nama: z.string().min(2, "Nama minimal 2 karakter"),
    jenisKelamin: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),
    tempatLahir: z.string().optional(),
    tanggalLahir: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid")
        .optional(),

    noHp: z.string().optional(),
    email: z.string().email("Email tidak valid").optional().or(z.literal("")),
    kewarganegaraan: z.string().optional(),

    agama: z.enum([
        "ISLAM",
        "KRISTEN",
        "KATOLIK",
        "HINDU",
        "BUDDHA",
        "KONGHUCU",
        "LAINNYA",
    ]),
    pekerjaan: z.string().optional(),
    pendidikan: z.enum([
        "TIDAK_SEKOLAH",
        "SD",
        "SMP",
        "SMA",
        "D1",
        "D2",
        "D3",
        "S1",
        "S2",
        "S3",
        "LAINNYA",
    ]),
    statusPerkawinan: z.enum([
        "BELUM_KAWIN",
        "KAWIN",
        "CERAI_HIDUP",
        "CERAI_MATI",
    ]),

    alamatId: z.string().optional(),
    keluargaId: z.string().optional(),
    statusDalamKeluarga: z
        .enum([
            "KEPALA_KELUARGA",
            "SUAMI",
            "ISTRI",
            "ANAK",
            "MENANTU",
            "CUCU",
            "ORANG_TUA",
            "MERTUA",
            "FAMILI_LAIN",
            "PEMBANTU",
            "LAINNYA",
        ])
        .optional(),
});

export type CitizenFormSchema = z.infer<typeof citizenFormSchema>;
