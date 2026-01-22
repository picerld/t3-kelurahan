"use client";

import GuardedLayout from "@/components/layout/GuardedLayout";
import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { Button } from "@/components/ui/button";
import { CitizenCreateForm } from "@/features/citizen/create/components/CitizenCreateForm";
import { ChevronLeft, FileUser } from "lucide-react";
import Link from "next/link";

export default function CitizenCreatePage() {
    return (
        <GuardedLayout
            headerTitle="Input Data Penduduk"
            headerSubtitle="Isi semua field untuk menambahkan data penduduk"
        >
            <HeadMetaData title="Data Penduduk" pathName="/citizens/create" />

            <div className="flex w-full items-center justify-between gap-2">
                <Link href="/citizens">
                    <Button variant="reversedGhost">
                        <ChevronLeft className="mr-1 size-4" />
                        Kembali
                    </Button>
                </Link>

                <Button variant={"outline"}>
                    <FileUser className="size-4" />
                </Button>
            </div>

            <CitizenCreateForm />
        </GuardedLayout>
    );
}
