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

type AddressSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function AddressSelectField({
  value,
  onChange,
  disabled = false,
}: AddressSelectFieldProps) {
  const utils = api.useUtils();

  const addressList = api.address.list.useQuery();
  const createAddress = api.address.create.useMutation({
    onSuccess: async () => {
      await utils.address.list.invalidate();
    },
    onError: (err) => {
      toast.error("Gagal membuat alamat", {
        description: err.message ?? "Silakan coba lagi.",
      });
    },
  });

  const isBusy = disabled || addressList.isLoading || createAddress.isPending;

  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const [form, setForm] = React.useState({
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    kodePos: "",
  });

  const [query, setQuery] = React.useState<string>("");
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return addressList.data ?? [];

    return (addressList.data ?? []).filter((a) => {
      const hay = [
        a.alamat,
        a.rt ? `rt ${a.rt}` : "",
        a.rw ? `rw ${a.rw}` : "",
        a.kelurahan ?? "",
        a.kecamatan ?? "",
        a.kabupaten ?? "",
        a.provinsi ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [addressList.data, query]);

  React.useEffect(() => {
    // If list refetch happens, keep query; no action
  }, [addressList.data]);

  async function handleCreate() {
    if (!form.alamat.trim()) {
      toast.error("Alamat wajib diisi");
      return;
    }

    const res = await createAddress.mutateAsync({
      alamat: form.alamat.trim(),
      rt: form.rt.trim() ?? undefined,
      rw: form.rw.trim() ?? undefined,
      kelurahan: form.kelurahan.trim() ?? undefined,
      kecamatan: form.kecamatan.trim() ?? undefined,
      kabupaten: form.kabupaten.trim() ?? undefined,
      provinsi: form.provinsi.trim() ?? undefined,
      kodePos: form.kodePos.trim() ?? undefined,
    });

    toast.success("Alamat dibuat");

    onChange(res.id);
    setDialogOpen(false);
    setForm({
      alamat: "",
      rt: "",
      rw: "",
      kelurahan: "",
      kecamatan: "",
      kabupaten: "",
      provinsi: "",
      kodePos: "",
    });
  }

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <Field>
          <FieldLabel className="font-semibold">Alamat</FieldLabel>

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
                placeholder={
                  addressList.isLoading ? "Loading alamat..." : "Pilih alamat"
                }
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
                    placeholder="Cari alamat..."
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
                  filtered.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.alamat}
                      {a.rt ? ` RT ${a.rt}` : ""}
                      {a.rw ? ` / RW ${a.rw}` : ""}
                      {a.kelurahan ? `, ${a.kelurahan}` : ""}
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
            <Plus className="size-4 mr-2" /> Alamat Baru
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tambah Alamat</DialogTitle>
          </DialogHeader>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field>
                <FieldLabel className="font-semibold">Alamat</FieldLabel>
                <Input
                  className="h-12 rounded-xl"
                  value={form.alamat}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, alamat: e.target.value }))
                  }
                  placeholder="Jl. ... No. ..."
                  disabled={createAddress.isPending}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel className="font-semibold">RT</FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.rt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rt: e.target.value }))
                }
                disabled={createAddress.isPending}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">RW</FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.rw}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rw: e.target.value }))
                }
                disabled={createAddress.isPending}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Kelurahan</FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.kelurahan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kelurahan: e.target.value }))
                }
                disabled={createAddress.isPending}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Kecamatan</FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.kecamatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kecamatan: e.target.value }))
                }
                disabled={createAddress.isPending}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Kabupaten / Kota</FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.kabupaten}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kabupaten: e.target.value }))
                }
                disabled={createAddress.isPending}
              />
            </Field>

            <Field>
              <FieldLabel className="font-semibold">Provinsi</FieldLabel>
              <Input
                className="h-12 rounded-xl"
                value={form.provinsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, provinsi: e.target.value }))
                }
                disabled={createAddress.isPending}
              />
            </Field>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={createAddress.isPending}
            >
              Batal
            </Button>

            <Button
              type="button"
              onClick={handleCreate}
              disabled={createAddress.isPending || !form.alamat.trim()}
            >
              {createAddress.isPending ? "Menyimpan..." : "Simpan Alamat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
