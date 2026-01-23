import { citizenFormSchema } from "@/features/citizen/create/forms/citizen";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "generated/prisma";
import { z } from "zod";

const emptyToUndefined = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const citizenRouter = createTRPCRouter({
  paginate: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
        search: emptyToUndefined,
        keluargaId: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, keluargaId, cursor, search } = input;

      const where: Parameters<typeof ctx.db.citizen.findMany>[0]["where"] = {
        ...(keluargaId ? { keluargaId } : {}),
        ...(search
          ? {
            OR: [
              { nama: { contains: search, mode: "insensitive" } },
            ],
          }
          : {}),
      };

      const rows = await ctx.db.citizen.findMany({
        where,
        take: limit + 1,
        ...(cursor
          ? {
            cursor: { id: cursor },
            skip: 1,
          }
          : {}),
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          nik: true,
          nama: true,
          jenisKelamin: true,
          tempatLahir: true,
          tanggalLahir: true,
          noHp: true,
          email: true,
          kewarganegaraan: true,
          alamatId: true,
          keluargaId: true,
          statusDalamKeluarga: true,
          createdAt: true,
          updatedAt: true,
          // OPTIONAL
          agama: true,
          pekerjaan: true,
          pendidikan: true,
          statusPerkawinan: true,
          // RELATION
          alamat: true,
          keluarga: true,
        },
      });

      let nextCursor: string | null = null;

      if (rows.length > limit) {
        const nextItem = rows.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: rows,
        nextCursor,
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.citizen.delete({
          where: { id: input.id },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2003"
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Tidak dapat menghapus data warga karena terdapat item di dalamnya!",
          });
        }
        throw error;
      }
    }),

  deleteMany: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.citizen.deleteMany({
        where: { id: { in: input.ids } },
      });
    }),

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
