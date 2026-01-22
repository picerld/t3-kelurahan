import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const familyRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.family.findMany({
      select: { id: true, noKK: true, namaKepala: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        noKK: z.string().regex(/^\d{16}$/, "No KK harus 16 digit angka"),
        namaKepala: z.string().optional(),
        kepalaNIK: z.string().optional(),
        alamatId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.family.create({
        data: {
          noKK: input.noKK,
          namaKepala: input.namaKepala?.trim() ?? null,
          kepalaNIK: input.kepalaNIK?.trim() ?? null,
          alamatId: input.alamatId ?? null,
        },
        select: { id: true },
      });
    }),
});
