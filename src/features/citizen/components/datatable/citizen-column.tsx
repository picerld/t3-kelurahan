import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { LongText } from "@/components/ui/long-text";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-action";
import type { Citizen } from "@/types/citizen";

export const citizenColumns: ColumnDef<Citizen>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ??
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn("max-md:sticky start-0 z-10 rounded-tl-[inherit]"),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nik",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIK" />
    ),
    cell: ({ row }) => (
      <div className="w-fit ps-2 text-nowrap">{row.getValue("nik")}</div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      const v = (row.getValue(columnId) as string) ?? "";
      return v.toLowerCase().includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    accessorKey: "nama",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => (
      <LongText className="ps-3">{row.getValue("nama")}</LongText>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]",
        "ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none",
      ),
    },
    filterFn: (row, columnId, filterValue: string) => {
      const v = (row.getValue(columnId) as string) ?? "";
      return v.toLowerCase().includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    accessorKey: "jenisKelamin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Kelamin" />
    ),
    cell: ({ row }) => {
      const jk = row.getValue("jenisKelamin");
      
      return (
        <div className="ps-2">
          <Badge variant="secondary">{jk}</Badge>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "tanggalLahir",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal Lahir" />
    ),
    cell: ({ row }) => {
      const v = row.getValue("tanggalLahir") as Date | string | null;
      const d = v ? new Date(v) : null;

      return (
        <div className="ps-2 text-nowrap">
          {d && !Number.isNaN(d.getTime())
            ? d.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "tempatLahir",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tempat Lahir" />
    ),
    cell: ({ row }) => (
      <LongText className="ps-3">
        {(row.getValue("tempatLahir")) ?? "-"}
      </LongText>
    ),
  },
  {
    accessorKey: "noHp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. HP" />
    ),
    cell: ({ row }) => (
      <div className="ps-2 text-nowrap">{(row.getValue("noHp")) ?? "-"}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat" />
    ),
    cell: ({ row }) => {
      const v = row.getValue("createdAt") as Date | string;
      const d = new Date(v);
      return (
        <div className="ps-2 text-nowrap">
          {Number.isNaN(d.getTime()) ? "-" : d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: DataTableRowActions,
  },
];
