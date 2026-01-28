"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

function StatCardSkeleton() {
    return (
        <Card className="bg-card border-border rounded-2xl">
            <CardContent className="px-5 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[50px] w-[50px] rounded-full" />
                    <Skeleton className="h-5 w-32 rounded-md" />
                </div>

                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-28 rounded-md" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>
            </CardContent>
        </Card>
    );
}

function FeaturedRowSkeleton() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 w-[304px] min-w-0">
                <Skeleton className="w-[90px] h-[70px] shrink-0 rounded-[14px]" />
                <div className="min-w-0 w-full">
                    <Skeleton className="h-5 w-44 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md mt-2" />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-32 rounded-md" />
                <Skeleton className="h-6 w-14 rounded-full" />
            </div>

            <Skeleton className="h-[50px] w-[50px] rounded-full" />
        </div>
    );
}

function TopClientRowSkeleton() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Skeleton className="h-[46px] w-[46px] rounded-full" />
                <div>
                    <Skeleton className="h-5 w-28 rounded-md" />
                    <Skeleton className="h-4 w-40 rounded-md mt-2" />
                </div>
            </div>
            <Skeleton className="h-6 w-14 rounded-full" />
        </div>
    );
}

function DriverRowSkeleton() {
    return (
        <div className="flex items-center gap-3">
            <Skeleton className="h-[46px] w-[46px] rounded-full" />
            <div className="w-full">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md mt-2" />
            </div>
        </div>
    );
}

export default function DashboardSkeleton({ days = 14 }: { days?: number }) {
    return (
        <div className="flex gap-1">
            <div className="flex-1 flex flex-col gap-[50px] pr-[30px]">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48 rounded-md" />
                        <Button
                            disabled
                            variant="outline"
                            className="w-[170px] justify-between border-border hover:bg-accent rounded-xl opacity-100"
                        >
                            <span className="font-semibold text-sm">Last {days} Days</span>
                            <ChevronDown className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-48 rounded-md" />
                    </div>

                    <div className="flex flex-col gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <FeaturedRowSkeleton />
                                {i < 2 && <hr className="border-border" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <aside className="w-[440px] shrink-0 flex flex-col gap-[30px] bg-card p-[30px] rounded-l-[36px]">
                <Card className="bg-primary border-0 rounded-[36px] text-primary-foreground">
                    <CardContent className="p-[30px] flex flex-col gap-5">
                        <Skeleton className="h-7 w-7 rounded-md bg-primary-foreground/20" />
                        <div>
                            <Skeleton className="h-4 w-20 rounded-md bg-primary-foreground/20" />
                            <Skeleton className="h-[46px] w-56 rounded-md mt-3 bg-primary-foreground/20" />
                        </div>
                        <Skeleton className="h-4 w-28 rounded-md bg-primary-foreground/20" />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-40 rounded-md" />
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <TopClientRowSkeleton />
                                {i < 2 && <hr className="border-border" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-44 rounded-md" />
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <React.Fragment key={i}>
                                <DriverRowSkeleton />
                                {i < 2 && <hr className="border-border" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
}
