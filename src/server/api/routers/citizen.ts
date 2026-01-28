import { citizenFormSchema } from "@/features/citizen/create/forms/citizen";
import { addDays, formatYYYYMMDD, startOfDay } from "@/lib/utils";
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
  summary: protectedProcedure
    .input(z.object({ days: z.number().int().min(1).max(365).default(30) }))
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);
      const prevSince = new Date(Date.now() - input.days * 2 * 24 * 60 * 60 * 1000);
      const prevUntil = since;

      const [
        totalCitizensAll,
        totalFamiliesAll,

        totalCitizensPeriod,
        totalFamiliesPeriod,

        prevCitizensPeriod,
        prevFamiliesPeriod,
      ] = await Promise.all([
        ctx.db.citizen.count(),
        ctx.db.family.count(),

        ctx.db.citizen.count({ where: { createdAt: { gte: since } } }),
        ctx.db.family.count({ where: { createdAt: { gte: since } } }),

        ctx.db.citizen.count({ where: { createdAt: { gte: prevSince, lt: prevUntil } } }),
        ctx.db.family.count({ where: { createdAt: { gte: prevSince, lt: prevUntil } } }),
      ]);

      const pct = (curr: number, prev: number) => {
        if (prev <= 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
      };

      return {
        period: { days: input.days, since },
        kpis: {
          totalCitizensAll,
          totalFamiliesAll,
          totalCitizensPeriod,
          totalFamiliesPeriod,
        },
        deltas: {
          citizensPeriodPct: pct(totalCitizensPeriod, prevCitizensPeriod),
          familiesPeriodPct: pct(totalFamiliesPeriod, prevFamiliesPeriod),
        },
      };
    }),

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

          agama: input.agama,
          pekerjaan: input.pekerjaan ?? null,
          pendidikan: input.pendidikan,
          statusPerkawinan: input.statusPerkawinan,

          alamatId: input.alamatId ?? null,
          keluargaId: input.keluargaId ?? null,
          statusDalamKeluarga: input.statusDalamKeluarga ?? null,
        },
        select: { id: true },
      });

      return created;
    }),

    getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const citizen = await ctx.db.citizen.findFirst({
        where: { id: input.id },
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

      if (!citizen) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Citizen not found" });
      }

      return citizen;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: citizenFormSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const d = input.data;

      return ctx.db.citizen.update({
        where: { id: input.id },
        data: {
          nik: d.nik,
          nama: d.nama,
          jenisKelamin: d.jenisKelamin,
          tempatLahir: d.tempatLahir?.trim() ?? null,
          tanggalLahir: d.tanggalLahir ? new Date(d.tanggalLahir) : null,
          noHp: d.noHp?.trim() ?? null,
          email: d.email?.trim() ?? null,
          kewarganegaraan: d.kewarganegaraan?.trim() ?? null,

          agama: d.agama,
          pekerjaan: d.pekerjaan,
          pendidikan: d.pendidikan,
          statusPerkawinan: d.statusPerkawinan,

          alamatId: d.alamatId ?? null,
          keluargaId: d.keluargaId ?? null,
          statusDalamKeluarga: d.statusDalamKeluarga ?? null,
        },
        include: {
          alamat: true,
          keluarga: true,
        }
      });
    }),

  // CHART & OVERVIEW
  overview: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);

      const [citizens, families] = await Promise.all([
        ctx.db.citizen.count({ where: { createdAt: { gte: since } } }),
        ctx.db.family.count({ where: { createdAt: { gte: since } } }),
      ]);

      return { period: { days: input.days, since }, citizens, families };
    }),

  timeseries: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const today = startOfDay(new Date());
      const since = startOfDay(addDays(today, -input.days + 1));
      const until = addDays(today, 1);

      const [citizens, families] = await Promise.all([
        ctx.db.citizen.findMany({
          where: { createdAt: { gte: since, lt: until } },
          select: { createdAt: true },
        }),
        ctx.db.family.findMany({
          where: { createdAt: { gte: since, lt: until } },
          select: { createdAt: true },
        }),
      ]);

      const citizenMap = new Map<string, number>();
      const familyMap = new Map<string, number>();

      for (const c of citizens) {
        const key = formatYYYYMMDD(startOfDay(c.createdAt));
        citizenMap.set(key, (citizenMap.get(key) ?? 0) + 1);
      }

      for (const f of families) {
        const key = formatYYYYMMDD(startOfDay(f.createdAt));
        familyMap.set(key, (familyMap.get(key) ?? 0) + 1);
      }

      const points: Array<{ date: string; citizens: number; families: number }> = [];
      for (let d = new Date(since); d < until; d = addDays(d, 1)) {
        const key = formatYYYYMMDD(d);
        points.push({
          date: key,
          citizens: citizenMap.get(key) ?? 0,
          families: familyMap.get(key) ?? 0,
        });
      }

      return { period: { days: input.days, since }, points };
    }),

  genderSplit: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);

      const groups = await ctx.db.citizen.groupBy({
        by: ["jenisKelamin"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      });

      const L = groups.find((g) => g.jenisKelamin === "L")?._count._all ?? 0;
      const P = groups.find((g) => g.jenisKelamin === "P")?._count._all ?? 0;

      return {
        period: { days: input.days, since },
        items: [
          { gender: "L", value: L },
          { gender: "P", value: P },
        ],
      };
    }),

  topOccupation: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(1).max(365).default(30),
        limit: z.number().int().min(3).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const since = new Date(Date.now() - input.days * 24 * 60 * 60 * 1000);

      const groups = await ctx.db.citizen.groupBy({
        by: ["pekerjaan"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      });

      const items = groups
        .filter((g) => g.pekerjaan !== null)
        .sort((a, b) => b._count._all - a._count._all)
        .slice(0, input.limit)
        .map((g) => ({ name: String(g.pekerjaan), value: g._count._all }));

      return { period: { days: input.days, since }, items };
    }),
});
