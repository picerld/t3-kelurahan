"use client";

import React from "react";
import {
  Calendar,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  BadgeCheck,
  IdCard,
  Clock,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Citizen } from "@/types/citizen";
import { cn } from "@/lib/utils";

type CitizenDialogProps = {
  currentRow: Citizen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatDate(v?: Date | string | null) {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(v?: Date | string | null) {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <div className="h-px w-full bg-border" />
      {children}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  badge,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-border bg-primary/10 p-5",
        className
      )}
    >
      <div className="mt-0.5 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-card">
        <Icon className="h-5 w-5 text-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-base font-bold text-foreground">
          {value}
        </p>
      </div>

      {badge ? <div className="mt-1 shrink-0">{badge}</div> : null}
    </div>
  );
}

export function CitizenDetailsDialog({
  currentRow,
  onOpenChange,
  open,
}: CitizenDialogProps) {
  if (!currentRow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "sm:max-w-3xl",
          "max-h-[85vh] p-0",
          "flex flex-col",
          "border border-border bg-card rounded-[36px]"
        )}
      >
        <div className="shrink-0">
          <div className="flex items-start justify-between gap-4 p-6 sm:p-8">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-foreground">
                Detail Warga
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-foreground">
                  {currentRow.nama}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {currentRow.nik}
                </span>
                <Badge variant="secondary" className="rounded-xl">
                  NIK
                </Badge>
              </div>

              <DialogDescription className="text-base text-muted-foreground">
                Informasi lengkap tentang warga &quot;{currentRow.nama}&quot;
              </DialogDescription>
            </DialogHeader>

            <DialogClose className="h-[46px] w-[46px] rounded-full border-border hover:bg-accent">
              <Button
                variant="outline"
                size="icon"
                className="h-[46px] w-[46px] rounded-full border-border hover:bg-accent"
              >
                <X className="size-5" />
              </Button>
            </DialogClose>
          </div>

          <div className="h-px w-full bg-border" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto hide-scrollbar p-6 sm:p-8 space-y-10">
          <Section title="Informasi Umum">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard icon={IdCard} label="NIK" value={currentRow.nik} />
              <InfoCard icon={User} label="Nama" value={currentRow.nama} />

              <InfoCard
                icon={BadgeCheck}
                label="Jenis Kelamin"
                value={currentRow.jenisKelamin}
                badge={
                  <Badge variant="secondary" className="rounded-xl">
                    {currentRow.jenisKelamin}
                  </Badge>
                }
              />

              <InfoCard
                icon={Users}
                label="Status Dalam Keluarga"
                value={currentRow.statusDalamKeluarga ?? "-"}
                badge={
                  <Badge variant="outline" className="rounded-xl">
                    {currentRow.statusDalamKeluarga ?? "-"}
                  </Badge>
                }
              />

              <InfoCard
                icon={Calendar}
                label="Tanggal Lahir"
                value={formatDate(currentRow.tanggalLahir)}
              />

              <InfoCard
                icon={MapPin}
                label="Tempat Lahir"
                value={currentRow.tempatLahir ?? "-"}
              />
            </div>
          </Section>

          <Section title="Kontak">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard icon={Phone} label="No. HP" value={currentRow.noHp ?? "-"} />
              <InfoCard icon={Mail} label="Email" value={currentRow.email ?? "-"} />
            </div>
          </Section>

          <Section title="Data Tambahan">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                icon={BadgeCheck}
                label="Kewarganegaraan"
                value={currentRow.kewarganegaraan ?? "-"}
              />
              <InfoCard icon={Hash} label="Keluarga ID" value={currentRow.keluargaId ?? "-"} />
              <InfoCard
                icon={Hash}
                label="Alamat ID"
                value={currentRow.alamatId ?? "-"}
                className="md:col-span-2"
              />
            </div>
          </Section>

          <Section title="Metadata">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                icon={Clock}
                label="Dibuat"
                value={formatDateTime(currentRow.createdAt)}
              />
            </div>
          </Section>
        </div>

        <div className="shrink-0">
          <div className="h-px w-full bg-border" />
          <div className="flex items-center justify-end gap-3 p-4 sm:p-6">
            <DialogClose asChild>
              <Button
                variant="reversedGhost"
                className="rounded-xl border-border hover:bg-accent"
              >
                Tutup
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
