import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const addressRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.address.findMany({
      select: {
        id: true,
        alamat: true,
        rt: true,
        rw: true,
        kelurahan: true,
        kecamatan: true,
        kabupaten: true,
        provinsi: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        alamat: z.string().min(3, "Alamat wajib diisi"),
        rt: z.string().optional(),
        rw: z.string().optional(),
        kelurahan: z.string().optional(),
        kecamatan: z.string().optional(),
        kabupaten: z.string().optional(),
        provinsi: z.string().optional(),
        kodePos: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.address.create({
        data: {
          alamat: input.alamat,
          rt: input.rt?.trim() ?? null,
          rw: input.rw?.trim() ?? null,
          kelurahan: input.kelurahan?.trim() ?? null,
          kecamatan: input.kecamatan?.trim() ?? null,
          kabupaten: input.kabupaten?.trim() ?? null,
          provinsi: input.provinsi?.trim() ?? null,
          kodePos: input.kodePos?.trim() ?? null,
        },
        select: { id: true },
      });
    }),
});
