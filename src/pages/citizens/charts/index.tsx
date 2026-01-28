"use client";

import React from "react";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { api } from "@/utils/api";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, TrendingUp, Users, Briefcase, Calendar } from "lucide-react";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const DAY_OPTIONS = [
    { label: "7 Hari Terakhir", days: 7 },
    { label: "14 Hari Terakhir", days: 14 },
    { label: "30 Hari Terakhir", days: 30 },
    { label: "90 Hari Terakhir", days: 90 },
] as const;

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    trend?: string;
}) {
    return (
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 rounded-2xl transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
                        <p className="text-xs text-muted-foreground">{subtitle}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-kreatop-mint" />
                            <span className="text-sm font-medium text-kreatop-mint">{trend}</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ChartsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-card border-border rounded-2xl">
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-12 gap-5">
                <Card className="col-span-12 bg-card border-border rounded-2xl">
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-56 mb-4" />
                        <Skeleton className="h-[400px] w-full" />
                    </CardContent>
                </Card>

                <Card className="col-span-12 lg:col-span-6 bg-card border-border rounded-2xl">
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-44 mb-4" />
                        <Skeleton className="h-[360px] w-full" />
                    </CardContent>
                </Card>

                <Card className="col-span-12 lg:col-span-6 bg-card border-border rounded-2xl">
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-44 mb-4" />
                        <Skeleton className="h-[360px] w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ChartsPage() {
    const [days, setDays] = React.useState<number>(30);

    const selectedLabel = React.useMemo(() => {
        return DAY_OPTIONS.find((o) => o.days === days)?.label ?? `${days} Hari Terakhir`;
    }, [days]);

    const timeseries = api.citizen.timeseries.useQuery({ days });
    const gender = api.citizen.genderSplit.useQuery({ days });
    const occupation = api.citizen.topOccupation.useQuery({ days, limit: 8 });

    const isFirstLoading = timeseries.isLoading || gender.isLoading || occupation.isLoading;
    const isFetching = timeseries.isFetching || gender.isFetching || occupation.isFetching;

    // Calculate totals for stat cards
    const totalCitizens = React.useMemo(() => {
        return timeseries.data?.points?.reduce((acc, p) => acc + (p.citizens || 0), 0) || 0;
    }, [timeseries.data]);

    const totalFamilies = React.useMemo(() => {
        return timeseries.data?.points?.reduce((acc, p) => acc + (p.families || 0), 0) || 0;
    }, [timeseries.data]);

    const totalOccupations = React.useMemo(() => {
        return occupation.data?.items?.reduce((acc, p) => acc + (p.value || 0), 0) || 0;
    }, [occupation.data]);

    // shadcn chart configs
    const tsConfig = {
        citizens: {
            label: "Penduduk",
            color: "var(--primary)",
        },
        families: {
            label: "Keluarga",
            color: "var(--chart-3)",
        },
    } as const;

    const genderConfig = {
        value: { label: "Jumlah" },
        L: {
            label: "Laki-laki",
            color: "var(--chart-3)",
        },
        P: {
            label: "Perempuan",
            color: "var(--chart-1)",
        },
    } as const;

    const occConfig = {
        value: { label: "Jumlah", },
    } as const;

    return (
        <GuardedLayout headerTitle="Analitik Data" headerSubtitle="Visualisasi statistik penduduk">
            <HeadMetaData title="Charts" pathName="/charts" />

            {/* Header Section with improved styling */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 px-4 py-1.5 rounded-full font-medium"
                    >
                        {selectedLabel}
                    </Badge>
                    {isFetching && (
                        <Badge
                            variant="secondary"
                            className="bg-kreatop-mint/10 text-kreatop-mint border-kreatop-mint/20 animate-pulse px-4 py-1.5 rounded-full font-medium"
                        >
                            Memperbarui data...
                        </Badge>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-[200px] justify-between border-border hover:bg-accent rounded-xl font-medium shadow-sm transition-all"
                        >
                            <span className="text-sm">{selectedLabel}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
                        {DAY_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                                key={opt.days}
                                onClick={() => setDays(opt.days)}
                                className="flex items-center justify-between gap-4 cursor-pointer rounded-lg"
                            >
                                <span className="font-medium">{opt.label}</span>
                                {opt.days === days && (
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isFirstLoading ? (
                <ChartsSkeleton />
            ) : (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <StatCard
                            title="Total Penduduk Baru"
                            value={totalCitizens.toLocaleString("id-ID")}
                            subtitle={`Terdaftar dalam ${days} hari terakhir`}
                            icon={Users}
                            trend="+12% dari periode sebelumnya"
                        />
                        <StatCard
                            title="Total Keluarga Baru"
                            value={totalFamilies.toLocaleString("id-ID")}
                            subtitle={`Terdaftar dalam ${days} hari terakhir`}
                            icon={Users}
                            trend="+8% dari periode sebelumnya"
                        />
                        <StatCard
                            title="Total Pekerjaan"
                            value={totalOccupations.toLocaleString("id-ID")}
                            subtitle="Kategori pekerjaan terdaftar"
                            icon={Briefcase}
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-12 gap-5">
                        {/* Area Chart - Enhanced */}
                        <Card className="col-span-12 bg-gradient-to-br from-card to-card/30 border-border/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="font-bold text-xl text-foreground mb-2">
                                            Tren Pendaftaran Harian
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Grafik penduduk dan keluarga baru per hari
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <ChartContainer config={tsConfig} className="h-[400px] w-full">
                                        <AreaChart
                                            data={timeseries.data?.points ?? []}
                                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                {/* Gradient with visible opacity for layering effect */}
                                                <linearGradient id="fillCitizens" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                                                </linearGradient>

                                                <linearGradient id="fillFamilies" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-chart-3)" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="var(--color-chart-3)" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid vertical={false} />

                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                minTickGap={32}
                                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                                tickFormatter={(v) =>
                                                    new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                                                }
                                            />

                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                            />

                                            <ChartTooltip
                                                content={<ChartTooltipContent indicator="dot" />}
                                                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                                            />
                                            <ChartLegend content={<ChartLegendContent />} />

                                            <Area
                                                type="natural"
                                                dataKey="citizens"
                                                stroke="var(--color-citizens)"
                                                fill="url(#fillCitizens)"
                                                strokeWidth={2.5}
                                                dot={false}
                                                activeDot={{ r: 5, strokeWidth: 2, fill: "var(--color-citizens)" }}
                                            />

                                            <Area
                                                type="natural"
                                                dataKey="families"
                                                stroke="var(--color-families)"
                                                fill="url(#fillFamilies)"
                                                strokeWidth={2.5}
                                                dot={false}
                                                activeDot={{ r: 5, strokeWidth: 2, fill: "var(--color-families)" }}
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gender Chart - Enhanced (Horizontal Bars) */}
                        <Card className="col-span-12 lg:col-span-6 bg-gradient-to-br from-card to-card/30 border-border/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="font-bold text-xl text-foreground mb-2">
                                            Distribusi Gender
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Perbandingan berdasarkan jenis kelamin
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-chart-1" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <ChartContainer config={genderConfig} className="h-[320px] w-full">
                                        <BarChart
                                            layout="vertical"
                                            data={gender.data?.items ?? []}
                                            margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="hsl(var(--border))" opacity={0.2} />
                                            <XAxis
                                                type="number"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="gender"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={12}
                                                width={90}
                                                tick={{ fill: 'hsl(var(--foreground))', fontSize: 13, fontWeight: 500 }}
                                                tickFormatter={(v) => v === "L" ? "Laki-laki" : "Perempuan"}
                                            />
                                            <ChartTooltip
                                                content={<ChartTooltipContent />}
                                                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                                            />
                                            <Bar
                                                layout="vertical"
                                                dataKey="value"
                                                radius={[0, 12, 12, 0]}
                                                maxBarSize={50}
                                            >
                                                {(gender.data?.items ?? []).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.gender === "L" ? "var(--color-primary)" : "var(--color-kreatop-purple)"}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </div>

                                <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
                                    {(gender.data?.items ?? []).map((item) => (
                                        <div key={item.gender} className="text-center">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {item.gender === "L" ? "Laki-laki" : "Perempuan"}
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {item.value.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-12 lg:col-span-6 bg-gradient-to-br from-card to-card/30 border-border/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="font-bold text-xl text-foreground mb-2">
                                            Pekerjaan Populer
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            8 kategori pekerjaan teratas
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                                        <Briefcase className="h-6 w-6 text-chart-2" />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-center">
                                    <ChartContainer config={occConfig} className="h-[240px] w-full max-w-[280px]">
                                        <PieChart>
                                            <ChartTooltip
                                                content={<ChartTooltipContent nameKey="name" hideLabel />}
                                            />
                                            <Pie
                                                data={occupation.data?.items ?? []}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius={70}
                                                outerRadius={120}
                                                paddingAngle={2}
                                                strokeWidth={2}
                                                stroke="hsl(var(--background))"
                                            >
                                                {(occupation.data?.items ?? []).map((_, idx) => (
                                                    <Cell
                                                        key={idx}
                                                        fill={COLORS[idx % COLORS.length]}
                                                        className="hover:opacity-80 transition-opacity"
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ChartContainer>
                                </div>

                                <div className="mt-6 pt-6 border-t border-border/50 space-y-3 max-h-[200px] overflow-y-auto hide-scrollbar">
                                    {(occupation.data?.items ?? []).map((item, idx) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div
                                                    className="h-3 w-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                                />
                                                <span className="text-sm text-muted-foreground truncate">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-foreground text-sm">
                                                {item.value.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </GuardedLayout>
    );
}
