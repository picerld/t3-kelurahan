"use client";

import Link from "next/link";
import { ChartNoAxesCombined, ChevronLeft } from "lucide-react";
import GuardedLayout from "@/components/layout/GuardedLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/utils/api";
import { CitizenForm } from "@/features/citizen/create/components/CitizenForm";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { useRouter } from "next/router";
import { LoadingDialog } from "@/components/dialog/LoadingDialog";

export default function Page() {
    const router = useRouter();

    const id = typeof router.query.id === "string" ? router.query.id : undefined;

    const { data: initialData, isLoading } = api.citizen.getById.useQuery(
        { id: id ?? "" },
        { enabled: router.isReady && !!id }
    );

    return (
        <GuardedLayout
            headerTitle={initialData ? `Profil Warga '${initialData.nama}'` : "Profil Warga"}
            headerSubtitle="Management data penduduk"
        >
            <HeadMetaData title="Edit Data Penduduk" pathName={id ? `/citizens/${id}/edit` : "/citizens"} />

            <div className="flex justify-between">
                <Link href="/citizens" className={buttonVariants({ variant: "outline" })}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>

                <Button size="icon-lg" variant="outline">
                    <ChartNoAxesCombined className="size-6" />
                </Button>
            </div>

            {isLoading || !router.isReady ? (
                <LoadingDialog open />
            ) : (
                <CitizenForm mode="edit" initialData={initialData} />
            )}
        </GuardedLayout>
    );
}
