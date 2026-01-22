"use client";

import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Button } from "@/components/ui/button";
import { CitizenSummaryCard } from "@/features/citizen/components/CitizenSummaryCard";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CitizenPage() {
    return (
        <GuardedLayout headerTitle="Data Penduduk" headerSubtitle="Management data penduduk">
            <HeadMetaData title="Data Penduduk" pathName="/citizens" />

            <CitizenSummaryCard />

            <div className="flex w-full justify-end mt-5">
                <Link href={"/citizens/create"}>
                    <Button>
                        <Plus className="size-4" /> Input Penduduk
                    </Button>
                </Link>
            </div>

            Table
        </GuardedLayout>
    );
}
