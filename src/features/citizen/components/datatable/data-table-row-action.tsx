import { type Row } from "@tanstack/react-table";
import { GripVertical, Info, Trash2, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAccessoriess } from "./citizen-provider";
import type { Citizen } from "@/types/citizen";
import { useRouter } from "next/navigation";

type DataTableRowActionsProps = {
  row: Row<Citizen>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const router = useRouter();
  
  const { setOpen, setCurrentRow } = useAccessoriess();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex h-9 w-9 p-0 rounded-full",
            "border-border bg-card",
            "hover:bg-accent",
            "data-[state=open]:bg-accent"
          )}
        >
          <GripVertical className="h-4 w-4 text-foreground" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[180px] rounded-2xl border border-border bg-card p-1 shadow-lg"
      >
        <DropdownMenuItem
          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("detail");
          }}
        >
          Detail
          <DropdownMenuShortcut>
            <Info className="h-4 w-4 text-foreground" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-border" />

        <DropdownMenuItem
          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => {
            router.push(`/citizens/edit/${row.original.id}`);
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen className="h-4 w-4 text-foreground" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("delete");
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 className="h-4 w-4 text-destructive" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
