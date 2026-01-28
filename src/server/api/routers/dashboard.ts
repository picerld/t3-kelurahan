import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const calcSince = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const whereSince = (days: number) => {
  if (days <= 0) return {};
  return { createdAt: { gte: calcSince(days) } };
};

export const dashboardRouter = createTRPCRouter({
  overview: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(0).max(366).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const isAll = input.days <= 0;
      const since = isAll ? null : calcSince(input.days);

      const prevSince = !isAll ? calcSince(input.days * 2) : null;
      const prevUntil = !isAll ? calcSince(input.days) : null;

      // ✅ KPI yang terfilter periode
      const [
        periodCitizens,
        periodFamilies,

        // ✅ tetap sediakan all-time kalau kamu butuh
        totalCitizensAll,
        totalFamiliesAll,

        // delta calc
        newCitizens,
        prevNewCitizens,
        newFamilies,
        prevNewFamilies,

        // ini biarin all-time dulu (atau filter kalau model ada createdAt)
        totalAddresses,
        totalUsers,
        verifiedUsers,
        activeSessions,
      ] = await Promise.all([
        ctx.db.citizen.count({ where: whereSince(input.days) }),
        ctx.db.family.count({ where: whereSince(input.days) }),

        ctx.db.citizen.count(),
        ctx.db.family.count(),

        ctx.db.citizen.count({ where: whereSince(input.days) }),
        !isAll
          ? ctx.db.citizen.count({
              where: { createdAt: { gte: prevSince!, lt: prevUntil! } },
            })
          : Promise.resolve(0),

        ctx.db.family.count({ where: whereSince(input.days) }),
        !isAll
          ? ctx.db.family.count({
              where: { createdAt: { gte: prevSince!, lt: prevUntil! } },
            })
          : Promise.resolve(0),

        ctx.db.address.count(),
        ctx.db.user.count(),
        ctx.db.user.count({ where: { emailVerified: true } }),
        ctx.db.session.count({ where: { expiresAt: { gt: now } } }),
      ]);

      const pct = (curr: number, prev: number) => {
        if (prev <= 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / prev) * 100);
      };

      // ✅ KPI yang dikirim ke UI: kalau semua data => all-time, kalau period => period
      const totalCitizens = isAll ? totalCitizensAll : periodCitizens;
      const totalFamilies = isAll ? totalFamiliesAll : periodFamilies;

      return {
        period: { days: input.days, since },

        kpis: {
          totalCitizens,
          totalFamilies,
          totalAddresses,
          totalUsers,
          verifiedUsers,
          activeSessions,

          // optional: expose all-time buat ditampilkan di UI kalau mau
          totalCitizensAll,
          totalFamiliesAll,
        },

        deltas: {
          newCitizensPct: isAll ? 0 : pct(newCitizens, prevNewCitizens),
          newFamiliesPct: isAll ? 0 : pct(newFamilies, prevNewFamilies),
        },
      };
    }),

  featuredCitizens: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(20).default(3),
        days: z.number().int().min(0).max(366).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.citizen.findMany({
        take: input.limit,
        where: input.days <= 0 ? {} : { createdAt: { gte: calcSince(input.days) } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          nik: true,
          nama: true,
          createdAt: true,
          jenisKelamin: true,
          keluarga: { select: { noKK: true, namaKepala: true } },
          alamat: { select: { kelurahan: true, kecamatan: true, kabupaten: true, provinsi: true } },
        },
      });
    }),

  topFamilies: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(20).default(3),
        days: z.number().int().min(0).max(366).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.family.findMany({
        take: input.limit,
        where: input.days <= 0 ? {} : { createdAt: { gte: calcSince(input.days) } },
        orderBy: { anggota: { _count: "desc" } },
        select: {
          id: true,
          noKK: true,
          namaKepala: true,
          kepalaNIK: true,
          _count: { select: { anggota: true } },
          alamat: { select: { kelurahan: true, kecamatan: true, kabupaten: true } },
        },
      });
    }),

  drivers: protectedProcedure
    .input(
      z.object({
        days: z.number().int().min(0).max(366).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.days <= 0 ? {} : { createdAt: { gte: calcSince(input.days) } };

      const genderGroups = await ctx.db.citizen.groupBy({
        by: ["jenisKelamin"],
        where,
        _count: { _all: true },
      });

      const occupationGroups = await ctx.db.citizen.groupBy({
        by: ["pekerjaan"],
        where,
        _count: { _all: true },
      });

      const educationGroups = await ctx.db.citizen.groupBy({
        by: ["pendidikan"],
        where,
        _count: { _all: true },
      });

      const total = genderGroups.reduce((a, b) => a + b._count._all, 0);
      const male = genderGroups.find((g) => g.jenisKelamin === "L")?._count._all ?? 0;
      const female = genderGroups.find((g) => g.jenisKelamin === "P")?._count._all ?? 0;

      const pickTopNonNull = <T extends { _count: { _all: number } }>(
        arr: Array<T & Record<string, any>>
      ) => {
        const nonNull = arr.filter((row) => {
          return !Object.entries(row).some(([k, v]) => k !== "_count" && v === null);
        });
        nonNull.sort((a, b) => b._count._all - a._count._all);
        return nonNull[0] ?? null;
      };

      const topOcc = pickTopNonNull(occupationGroups);
      const topEdu = pickTopNonNull(educationGroups);

      return {
        period: { days: input.days, since: input.days <= 0 ? null : calcSince(input.days) },
        gender: { total, male, female },
        topOccupation: topOcc?.pekerjaan ?? null,
        topOccupationCount: topOcc?._count._all ?? 0,
        topEducation: topEdu?.pendidikan ?? null,
        topEducationCount: topEdu?._count._all ?? 0,
      };
    }),
});
