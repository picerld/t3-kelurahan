"use client";

import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { CitizenSummaryCard } from "@/features/citizen/components/CitizenSummaryCard";
import { AccessoriesDialogs } from "@/features/citizen/components/datatable/citizen-dialog";
import { AccessoriessProvider } from "@/features/citizen/components/datatable/citizen-provider";
import { CitizenTable } from "@/features/citizen/components/datatable/citizen-table";

export default function CitizenPage() {
    return (
        <AccessoriessProvider>
            <GuardedLayout headerTitle="Data Penduduk" headerSubtitle="Management data penduduk">
                <HeadMetaData title="Data Penduduk" pathName="/citizens" />

                <CitizenSummaryCard />

                <CitizenTable />

                <AccessoriesDialogs />
            </GuardedLayout>
        </AccessoriessProvider>
    );
}
