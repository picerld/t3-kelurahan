"use client";

import * as React from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { api } from "@/utils/api";
import { Separator } from "@/components/ui/separator";

const NONE = "__none__";

type FamilySelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  alamatIdToLink?: string;
};

export function FamilySelectField({
  value,
  onChange,
  disabled = false,
  alamatIdToLink,
}: FamilySelectFieldProps) {
  const utils = api.useUtils();

  const familyList = api.family.list.useQuery();
  const createFamily = api.family.create.useMutation({
    onSuccess: async () => {
      await utils.family.list.invalidate();
    },
    onError: (err) => {
      toast.error("Gagal membuat keluarga", {
        description: err.message ?? "Silakan coba lagi.",
      });
    },
  });

  const isBusy = disabled || familyList.isLoading || createFamily.isPending;

  const [query, setQuery] = React.useState<string>("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return familyList.data ?? [];

    return (familyList.data ?? []).filter((f) => {
      const hay = [
        f.noKK,
        f.namaKepala ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [familyList.data, query]);

  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const [form, setForm] = React.useState({
    noKK: "",
    namaKepala: "",
    kepalaNIK: "",
  });

  async function handleCreate() {
    if (!/^\d{16}$/.test(form.noKK)) {
      toast.error("No KK harus 16 digit angka");
      return;
    }

    const res = await createFamily.mutateAsync({
      noKK: form.noKK,
      namaKepala: form.namaKepala.trim() ?? undefined,
      kepalaNIK: form.kepalaNIK.trim() ?? undefined,
      alamatId: alamatIdToLink?.trim() ? alamatIdToLink.trim() : undefined,
    });

    toast.success("Keluarga dibuat");
    onChange(res.id);
    setQuery("");
    setDialogOpen(false);
    setForm({ noKK: "", namaKepala: "", kepalaNIK: "" });
  }

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <Field>
          <FieldLabel className="font-semibold">Keluarga (KK)</FieldLabel>

          <Select
            value={value?.trim() ? value : NONE}
            onValueChange={(v) => {
              onChange(v === NONE ? "" : v);
              setQuery("");
            }}
            disabled={isBusy}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue
                placeholder={familyList.isLoading ? "Loading KK..." : "Pilih KK"}
              />
            </SelectTrigger>

            <SelectContent
              className="p-0 overflow-hidden"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className="p-2 border-b bg-popover">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari No KK / Nama Kepala..."
                    className="h-9 pl-9 rounded-lg"
                    disabled={isBusy}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
              </div>

              <div className="p-1">
                <SelectItem value={NONE}>(Kosongkan)</SelectItem>

                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Tidak ada hasil.
                  </div>
                ) : (
                  filtered.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.noKK}
                      {f.namaKepala ? ` - ${f.namaKepala}` : ""}
                    </SelectItem>
                  ))
                )}
              </div>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl"
            disabled={disabled}
          >
            <Plus className="size-4 mr-2" /> KK Baru
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tambah Keluarga (KK)</DialogTitle>
          </DialogHeader>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field>
                <FieldLabel className="font-semibold">No KK</FieldLabel>
                <Input
                  className="h-12 rounded-xl"
                  value={form.noKK}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, noKK: e.target.value }))
                  }
                  placeholder="16 digit No KK"
                  disabled={createFamily.isPending}
                  inputMode="numeric"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel className="font-semibold">
                Nama Kepala (opsional)
              </FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.namaKepala}
                onChange={(e) =>
                  setForm((p) => ({ ...p, namaKepala: e.target.value }))
                }
                disabled={createFamily.isPending}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">
                NIK Kepala (opsional)
              </FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.kepalaNIK}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kepalaNIK: e.target.value }))
                }
                disabled={createFamily.isPending}
                inputMode="numeric"
              />
            </Field>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={createFamily.isPending}
            >
              Batal
            </Button>

            <Button
              type="button"
              onClick={handleCreate}
              disabled={createFamily.isPending || !/^\d{16}$/.test(form.noKK)}
            >
              {createFamily.isPending ? "Menyimpan..." : "Simpan KK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
