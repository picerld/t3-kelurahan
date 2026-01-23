"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import type { Citizen } from "@/types/citizen";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";

type AccessoriesDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Citizen;
};

export function AccessoriesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: AccessoriesDeleteDialogProps) {
  const [value, setValue] = useState("");
  const utils = api.useUtils();

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const { mutate: deleteCitizen, isPending } = api.citizen.delete.useMutation({
    onSuccess: () => {
      toast.success("Berhasil!", {
        description: `Data warga "${currentRow.nama}" berhasil dihapus.`,
      });

      utils.citizen.paginate.invalidate();

      setValue("");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Gagal!", {
        description:
          error.data?.code === "UNAUTHORIZED"
            ? "Silahkan login terlebih dahulu"
            : error.message || "Terjadi kesalahan saat menghapus data warga",
      });
    },
  });

  const handleDelete = () => {
    if (value.trim() !== currentRow.nama) {
      toast.error("Nama tidak cocok", {
        description:
          "Silakan ketik nama warga dengan benar untuk konfirmasi penghapusan.",
      });
      return;
    }

    deleteCitizen({ id: currentRow.id });
  };

  const expected = currentRow?.nama ?? "";
  const isMatch = value.trim() === expected;
  const disabled = !isMatch || isPending;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        // prevent closing mid-mutation
        if (isPending) return;
        if (!state) setValue("");
        onOpenChange(state);
      }}
      handleConfirm={handleDelete}
      disabled={disabled}
      destructive
      title={
        <span className="flex items-center gap-2 text-destructive">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </span>
          <span className="text-base font-bold">Hapus Data Warga</span>
        </span>
      }
      desc={
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-foreground">
              Apakah kamu yakin ingin menghapus data warga{" "}
              <span className="font-bold">{expected}</span>?
              <br />
              <span className="text-muted-foreground">
                Data yang sudah dihapus tidak dapat dikembalikan.
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex flex-col items-start gap-1.5">
              <span className="text-sm font-semibold text-foreground">
                Ketik nama warga untuk konfirmasi
              </span>

              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={expected}
                disabled={isPending}
                autoComplete="off"
                className={cn(
                  "rounded-xl border-border bg-card",
                  "focus-visible:ring-ring",
                  !value
                    ? ""
                    : isMatch
                      ? "border-[var(--color-kreatop-green)]"
                      : "border-destructive"
                )}
              />

              <span className="text-xs text-muted-foreground">
                Harus sama persis: <span className="font-semibold">{expected}</span>
              </span>
            </Label>
          </div>

          <Alert
            className="rounded-2xl border-destructive/30 bg-destructive/10"
            // keep variant destructive if your component uses it for icons/colors;
            // but we already enforce colors above to match dashboard tokens
            variant="destructive"
          >
            <AlertTitle className="text-destructive">Warning!</AlertTitle>
            <AlertDescription className="text-foreground">
              Penghapusan bersifat permanen dan tidak bisa dibatalkan.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={
        isPending ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Menghapus...
          </>
        ) : (
          "Hapus"
        )
      }
    />
  );
}
