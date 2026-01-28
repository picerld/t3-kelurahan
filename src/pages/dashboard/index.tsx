"use client";

import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton";
import { api } from "@/utils/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Home,
  MapPin,
  BadgeCheck,
  KeyRound,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { formatPct } from "@/lib/utils";

export default function DashboardPage() {
  // ✅ Tahun ini (YTD)
  const ytdDays = React.useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diffMs = now.getTime() - start.getTime();
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
    return Math.min(366, Math.max(1, days));
  }, []);

  // ✅ Tambah "Semua data" (days = 0)
  const DAY_OPTIONS = React.useMemo(
    () =>
      [
        { label: "Semua data", days: 0 },
        { label: "Tahun ini", days: ytdDays },
        { label: "Bulan ini", days: 30 },
        { label: "Minggu ini", days: 7 },
        { label: "Hari ini", days: 1 },
      ] as const,
    [ytdDays]
  );

  // default: Bulan ini
  const [days, setDays] = React.useState<number>(30);

  const selectedLabel = React.useMemo(() => {
    return (
      DAY_OPTIONS.find((o) => o.days === days)?.label ?? `Last ${days} Days`
    );
  }, [days, DAY_OPTIONS]);

  const overview = api.dashboard.overview.useQuery({ days });
  const featured = api.dashboard.featuredCitizens.useQuery({ limit: 3, days });
  const topFamilies = api.dashboard.topFamilies.useQuery({ limit: 3, days });
  const drivers = api.dashboard.drivers.useQuery({ days });

  const kpis = overview.data?.kpis;
  const deltas = overview.data?.deltas;

  const stats = [
    {
      icon: Users,
      label: "Total Penduduk",
      value: kpis ? kpis.totalCitizens.toLocaleString("id-ID") : "—",
      change: deltas ? formatPct(deltas.newCitizensPct) : "—",
      color: "bg-purple-600",
      isNegative: (deltas?.newCitizensPct ?? 0) < 0,
    },
    {
      icon: Home,
      label: "Total Keluarga",
      value: kpis ? kpis.totalFamilies.toLocaleString("id-ID") : "—",
      change: deltas ? formatPct(deltas.newFamiliesPct) : "—",
      color: "bg-blue-600",
      isNegative: (deltas?.newFamiliesPct ?? 0) < 0,
    },
    {
      icon: MapPin,
      label: "Total Alamat",
      value: kpis ? kpis.totalAddresses.toLocaleString("id-ID") : "—",
      change: "+0%",
      color: "bg-amber-600",
      isNegative: false,
    },
    {
      icon: BadgeCheck,
      label: "Verified Users",
      value: kpis ? kpis.verifiedUsers.toLocaleString("id-ID") : "—",
      change: "+0%",
      color: "bg-emerald-600",
      isNegative: false,
    },
    {
      icon: KeyRound,
      label: "Active Sessions",
      value: kpis ? kpis.activeSessions.toLocaleString("id-ID") : "—",
      change: "+0%",
      color: "bg-pink-600",
      isNegative: false,
    },
    {
      icon: Users,
      label: "Total Users",
      value: kpis ? kpis.totalUsers.toLocaleString("id-ID") : "—",
      change: "+0%",
      color: "bg-cyan-600",
      isNegative: false,
    },
  ];

  const featuredContent =
    featured.data?.map((c) => {
      const loc = [
        c.alamat?.kelurahan,
        c.alamat?.kecamatan,
        c.alamat?.kabupaten,
        c.alamat?.provinsi,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        title: c.nama,
        date: new Date(c.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        views: loc || `NIK: ${c.nik}`,
        change: "+0%",
        isNegative: false,
      };
    }) ?? [];

  const topClients =
    topFamilies.data?.map((f) => ({
      name: f.namaKepala ? `${f.namaKepala} (KK ${f.noKK})` : `KK ${f.noKK}`,
      revenue: `${f._count.anggota.toLocaleString("id-ID")} Anggota`,
      change: "+0%",
      isNegative: false,
    })) ?? [];

  const revenueDrivers = [
    {
      title: "Gender Split",
      subtitle: drivers.data
        ? `L: ${drivers.data.gender.male.toLocaleString(
            "id-ID"
          )} • P: ${drivers.data.gender.female.toLocaleString("id-ID")}`
        : "—",
    },
    {
      title: "Pekerjaan Terbanyak",
      subtitle: drivers.data?.topOccupation
        ? `${drivers.data.topOccupation} • ${drivers.data.topOccupationCount.toLocaleString(
            "id-ID"
          )} orang`
        : "—",
    },
    {
      title: "Pendidikan Terbanyak",
      subtitle: drivers.data?.topEducation
        ? `${drivers.data.topEducation} • ${drivers.data.topEducationCount.toLocaleString(
            "id-ID"
          )} orang`
        : "—",
    },
  ];

  const isFirstLoading =
    overview.isLoading ||
    featured.isLoading ||
    topFamilies.isLoading ||
    drivers.isLoading;

  const isRefetching =
    overview.isFetching ||
    featured.isFetching ||
    topFamilies.isFetching ||
    drivers.isFetching;

  return (
    <GuardedLayout>
      <HeadMetaData title="Dashboard" pathName="/dashboard" />

      {isFirstLoading ? (
        <DashboardSkeleton days={days} />
      ) : (
        <>
          {isRefetching ? (
            <div className="mb-3">
              <Badge className="bg-secondary text-muted-foreground hover:bg-secondary">
                Updating…
              </Badge>
            </div>
          ) : null}

          <div className="flex gap-1">
            <div className="flex-1 flex flex-col gap-[50px] pr-[30px]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-foreground">
                    Latest Statistics
                  </h2>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[170px] justify-between border-border hover:bg-accent rounded-xl"
                      >
                        <span className="font-semibold text-sm">
                          {selectedLabel}
                        </span>
                        <ChevronDown className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="rounded-xl">
                      {DAY_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                          key={opt.label}
                          onClick={() => setDays(opt.days)}
                          className="flex items-center justify-between gap-6"
                        >
                          <span>{opt.label}</span>
                          {opt.days === days ? (
                            <span className="text-xs text-muted-foreground">
                              ✓
                            </span>
                          ) : null}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {stats.map((stat, index) => (
                    <Card
                      key={index}
                      className="bg-card border-border rounded-2xl"
                    >
                      <CardContent className="px-5 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-[50px] w-[50px] rounded-full items-center justify-center ${stat.color}`}
                          >
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <span className="font-bold text-lg text-card-foreground">
                            {stat.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[28px] text-card-foreground">
                            {stat.value}
                          </p>
                          <Badge
                            className={`${
                              stat.isNegative
                                ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]"
                                : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"
                            } font-bold`}
                          >
                            {stat.change}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg text-foreground">
                    Feature Contents
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  {featuredContent.map((content, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 w-[304px] min-w-0">
                          <div className="flex w-[90px] h-[70px] shrink-0 rounded-[14px] bg-secondary" />
                          <div className="min-w-0">
                            <p className="font-bold truncate text-foreground">
                              {content.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {content.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-foreground">
                            {content.views}
                          </p>
                          <Badge
                            className={`${
                              content.isNegative
                                ? "bg-[#FFEAEC] text-[#FF001F] hover:bg-[#FFEAEC]"
                                : "bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE]"
                            } font-bold`}
                          >
                            {content.change}
                          </Badge>
                        </div>

                        <Link href={`/citizens`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-[50px] w-[50px] rounded-full border-border hover:bg-accent"
                          >
                            <ArrowRight className="h-6 w-6" />
                          </Button>
                        </Link>
                      </div>
                      {index < featuredContent.length - 1 && (
                        <hr className="border-border" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <aside className="w-[440px] shrink-0 flex flex-col gap-[30px] bg-card p-[30px] rounded-l-[36px]">
              <Card className="bg-primary border-0 rounded-[36px] text-primary-foreground">
                <CardContent className="p-[30px] flex flex-col gap-5">
                  <div className="text-2xl font-bold">K</div>
                  <div>
                    <p className="text-[#CCE4FF]">Total Penduduk</p>
                    <p className="font-bold text-[46px]">
                      {kpis ? kpis.totalCitizens.toLocaleString("id-ID") : "—"}
                    </p>
                  </div>

                  {/* ✅ mengikuti label dropdown */}
                  <p className="text-[#CCE4FF]">Period • {selectedLabel}</p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg text-card-foreground">
                  Top Big Clients
                </h2>
                <div className="flex flex-col gap-4">
                  {topClients.map((client, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-[46px] w-[46px] rounded-full bg-secondary" />
                          <div>
                            <p className="font-bold text-card-foreground">
                              {client.revenue}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.name}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-[#BFFFBE] text-[#03A900] hover:bg-[#BFFFBE] font-bold">
                          {client.change}
                        </Badge>
                      </div>
                      {index < topClients.length - 1 && (
                        <hr className="border-border" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="font-bold text-lg text-card-foreground">
                  Revenue Drivers
                </h2>
                <div className="flex flex-col gap-4">
                  {revenueDrivers.map((driver, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-[46px] w-[46px] rounded-full bg-primary" />
                        <div>
                          <p className="font-bold text-card-foreground">
                            {driver.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {driver.subtitle}
                          </p>
                        </div>
                      </div>
                      {index < revenueDrivers.length - 1 && (
                        <hr className="border-border" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </GuardedLayout>
  );
}
