"use client";

import React from "react";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { CitizenSummaryCard } from "@/features/citizen/components/CitizenSummaryCard";
import { AccessoriesDialogs } from "@/features/citizen/components/datatable/citizen-dialog";
import { AccessoriessProvider } from "@/features/citizen/components/datatable/citizen-provider";
import { CitizenTable } from "@/features/citizen/components/datatable/citizen-table";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DAY_OPTIONS = [
    { label: "Bulan ini", days: 30 },
    { label: "Minggu ini", days: 7 },
    { label: "Hari ini", days: 1 },
] as const;

export default function CitizenPage() {
    const [days, setDays] = React.useState<number>(30);

    const selectedLabel = React.useMemo(() => {
        return DAY_OPTIONS.find((o) => o.days === days)?.label ?? `Last ${days} Days`;
    }, [days]);

    return (
        <AccessoriessProvider>
            <GuardedLayout headerTitle="Data Penduduk" headerSubtitle="Management data penduduk">
                <HeadMetaData title="Data Penduduk" pathName="/citizens" />

                <div className="flex items-center justify-between mb-4">
                    <div className="min-w-0">
                        <h2 className="font-bold text-lg text-foreground">Ringkasan</h2>
                        <p className="text-sm text-muted-foreground">Periode: {selectedLabel}</p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-[170px] justify-between border-border hover:bg-accent rounded-xl"
                            >
                                <span className="font-semibold text-sm">{selectedLabel}</span>
                                <ChevronDown className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="rounded-xl">
                            {DAY_OPTIONS.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.days}
                                    onClick={() => setDays(opt.days)}
                                    className="flex items-center justify-between gap-6"
                                >
                                    <span>{opt.label}</span>
                                    {opt.days === days ? (
                                        <span className="text-xs text-muted-foreground">✓</span>
                                    ) : null}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <CitizenSummaryCard days={days} />

                <CitizenTable />

                <AccessoriesDialogs />
            </GuardedLayout>
        </AccessoriessProvider>
    );
}
