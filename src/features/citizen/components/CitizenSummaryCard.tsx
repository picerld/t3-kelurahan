"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { UserCheck, Users } from "lucide-react";

function formatPct(n: number) {
    const sign = n > 0 ? "+" : "";
    return `${sign}${n}%`;
}

export const CitizenSummaryCard = ({ days = 30 }: { days?: number }) => {
    const summary = api.citizen.summary.useQuery({ days });

    if (summary.isLoading) {
        return (
            <div className="grid grid-cols-2 gap-5">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} className="bg-card border-border rounded-2xl">
                        <CardContent className="px-5 flex flex-col gap-5">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-[50px] w-[50px] rounded-full" />
                                <Skeleton className="h-5 w-36 rounded-md" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-8 w-24 rounded-md" />
                                <Skeleton className="h-6 w-14 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (summary.error) {
        return (
            <div className="grid grid-cols-2 gap-5">
                <Card className="bg-card border-border rounded-2xl">
                    <CardContent className="px-5 py-6 text-sm text-destructive">
                        Failed to load summary: {summary.error.message}
                    </CardContent>
                </Card>
            </div>
        );
    }

    const kpis = summary.data?.kpis;
    const deltas = summary.data?.deltas;

    const stats = [
        {
            icon: Users,
            label: "Penduduk (Periode)",
            value: kpis ? kpis.totalCitizensPeriod.toLocaleString("id-ID") : "—",
            change: deltas ? formatPct(deltas.citizensPeriodPct) : "—",
            color: "bg-emerald-600",
            isNegative: (deltas?.citizensPeriodPct ?? 0) < 0,
        },
        {
            icon: UserCheck,
            label: "Keluarga (Periode)",
            value: kpis ? kpis.totalFamiliesPeriod.toLocaleString("id-ID") : "—",
            change: deltas ? formatPct(deltas.familiesPeriodPct) : "—",
            color: "bg-kreatop-blue",
            isNegative: (deltas?.familiesPeriodPct ?? 0) < 0,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-card border-border rounded-2xl">
                    <CardContent className="px-5 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className={`flex h-[50px] w-[50px] rounded-full items-center justify-center ${stat.color}`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-lg text-card-foreground">{stat.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-[28px] text-card-foreground">{stat.value}</p>
                            <Badge
                                className={`${stat.isNegative
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
    );
};
