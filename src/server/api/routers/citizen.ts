import { citizenFormSchema } from "@/features/citizen/create/forms/citizen";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const citizenRouter = createTRPCRouter({
  create: protectedProcedure
    .input(citizenFormSchema)
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.citizen.create({
        data: {
          nik: input.nik,
          nama: input.nama,
          jenisKelamin: input.jenisKelamin,
          tempatLahir: input.tempatLahir?.trim() ?? null,
          tanggalLahir: input.tanggalLahir
            ? new Date(input.tanggalLahir)
            : undefined,
          noHp: input.noHp?.trim() ?? null,
          email: input.email?.trim() ?? null,
          kewarganegaraan: input.kewarganegaraan?.trim() ?? null,

          alamatId: input.alamatId ?? null,
          keluargaId: input.keluargaId ?? null,
          statusDalamKeluarga: input.statusDalamKeluarga ?? null,
        },
        select: { id: true },
      });

      return created;
    }),
});
