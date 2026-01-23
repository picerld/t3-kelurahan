"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useTableUrlState } from "@/hooks/use-table-url-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/datatable/data-table-pagination";
import { DataTableBulkActions } from "./data-table-bulk-action";
import { citizenColumns as columns } from "./citizen-column";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { NavigateFn } from "@/hooks/use-table-url-state";
import { Eraser, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Citizen } from "@/types/citizen";
import { api } from "@/utils/api";
import Link from "next/link";
import useDebounce from "@/hooks/use-debounce";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CitizenTable() {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const searchObj = useMemo<Record<string, unknown>>(() => {
    const entries = Array.from(searchParams?.entries() ?? []).map(([k, v]) => {
      if (k === "keluargaId") {
        if (v === "" || v === "all") return [k, undefined];
        return [k, v];
      }

      const n = Number(v);
      return [k, !isNaN(n) && String(n) === v ? n : v];
    });

    return Object.fromEntries(entries);
  }, [searchParams]);

  const navigate: NavigateFn = ({ search, replace }) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (typeof search === "function") {
      const prev = Object.fromEntries(params.entries());
      const next = search(prev);
      const nextParams = new URLSearchParams();

      Object.entries(next).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") nextParams.set(k, String(v));
        else nextParams.delete(k);
      });

      replace
        ? router.replace(`${pathName}?${nextParams.toString()}`)
        : router.push(`${pathName}?${nextParams.toString()}`);
      return;
    }

    if (typeof search === "object" && search !== null) {
      const nextParams = new URLSearchParams();
      Object.entries(search).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") nextParams.set(k, String(v));
      });

      replace
        ? router.replace(`${pathName}?${nextParams.toString()}`)
        : router.push(`${pathName}?${nextParams.toString()}`);
      return;
    }

    replace
      ? router.replace(`${pathName}?${params.toString()}`)
      : router.push(`${pathName}?${params.toString()}`);
  };

  const { pagination, onPaginationChange, globalFilter } = useTableUrlState({
    search: searchObj,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: "search", trim: true },
  });

  const searchTerm = typeof globalFilter === "string" ? globalFilter : "";
  const debouncedSearch = useDebounce(searchTerm, 350);

  const keluargaId =
    typeof searchObj.keluargaId === "string" ? searchObj.keluargaId : undefined;

  useEffect(() => {
    onPaginationChange({ pageIndex: 0, pageSize: pagination.pageSize });
  }, [debouncedSearch, keluargaId]);

  const [pageCursors, setPageCursors] = useState<(string | null)[]>([null]);

  useEffect(() => {
    setPageCursors([null]);
  }, [debouncedSearch, keluargaId, pagination.pageSize]);

  const currentCursor = pageCursors[pagination.pageIndex] ?? null;

  const { data: familiesData, isLoading: isFamiliesLoading } =
    api.family.list.useQuery(undefined, { refetchOnWindowFocus: false });

  const { data, isLoading } = api.citizen.paginate.useQuery(
    {
      limit: pagination.pageSize,
      cursor: currentCursor,
      search: debouncedSearch || undefined,
      keluargaId: keluargaId ?? null,
    },
    { refetchOnWindowFocus: false }
  );

  console.log(data);

  const tableData: Citizen[] =
    data?.items?.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      tanggalLahir: item.tanggalLahir ? new Date(item.tanggalLahir) : null,
    })) ?? [];

  const nextCursor = data?.nextCursor ?? null;
  const hasNextPage = Boolean(nextCursor);

  useEffect(() => {
    if (!data) return;
    if (!hasNextPage) return;

    const nextPageIndex = pagination.pageIndex + 1;
    setPageCursors((prev) => {
      if (prev[nextPageIndex] === nextCursor) return prev;

      const copy = [...prev];
      while (copy.length < nextPageIndex) copy.push(null);
      copy[nextPageIndex] = nextCursor;
      return copy;
    });
  }, [data, hasNextPage, nextCursor, pagination.pageIndex]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: -1,
  });

  const isFiltering = Boolean(searchTerm?.trim()) || Boolean(keluargaId);

  const handleReset = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    params.delete("search");
    params.delete("keluargaId");

    params.delete("page");

    router.replace(`${pathName}?${params.toString()}`)
  }

  const setParam = (key: "keluargaId", val: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (!val || val === "all") params.delete(key);
    else params.set(key, val);

    params.delete("page");
    router.replace(`${pathName}?${params.toString()}`);
  };

  const setSearchParam = (val: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (!val.trim()) params.delete("search");
    else params.set("search", val);

    router.replace(`${pathName}?${params.toString()}`);
  };

  const keluargaSelectValue = keluargaId ?? "all";

  return (
    <div className={cn("flex flex-1 flex-col gap-4 mt-10")}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchParam(e.target.value)}
            placeholder="Cari nama warga..."
            className="max-w-sm rounded-xl"
          />

          <Select
            value={keluargaSelectValue}
            onValueChange={(val) => setParam("keluargaId", val)}
            disabled={isFamiliesLoading}
          >
            <SelectTrigger className="w-[260px] rounded-xl border-border bg-card">
              <SelectValue placeholder="Filter No. KK" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl border-border bg-card">
              <SelectItem value="all">Semua KK</SelectItem>
              {(familiesData ?? []).map((fam: any) => (
                <SelectItem key={fam.id} value={fam.id}>
                  {fam.noKK}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltering && (
            <Button
              variant="outline"
              size="lg" className="rounded-xl"
              onClick={handleReset}
            >
              Reset <Eraser className="size-4 ml-1" />
            </Button>
          )}
        </div>


        <Link href={"/citizens/create"}>
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Data
          </Button>
        </Link>
      </div>

      <div className="mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        currentPage={pagination.pageIndex + 1}
        lastPage={hasNextPage ? pagination.pageIndex + 2 : pagination.pageIndex + 1}
        perPage={pagination.pageSize}
        totalItems={0}
        onPageChange={(page) => {
          const nextIndex = page - 1;
          if (nextIndex > pagination.pageIndex && !hasNextPage) return;

          onPaginationChange({
            pageIndex: nextIndex,
            pageSize: pagination.pageSize,
          });
        }}
        onPerPageChange={(perPage) =>
          onPaginationChange({
            pageIndex: 0,
            pageSize: perPage,
          })
        }
      />

      <DataTableBulkActions table={table} />
    </div>
  );
}
