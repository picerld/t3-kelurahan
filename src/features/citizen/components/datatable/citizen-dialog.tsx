import { AccessoriesDeleteDialog } from "./citizen-delete-dialog";
import { CitizenDetailsDialog } from "./citizen-details-dialog";
import { useAccessoriess } from "./citizen-provider";

export function AccessoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useAccessoriess();

  return (
    <>
      {currentRow && (
        <>
          <CitizenDetailsDialog
            key={`accessories-detail-${currentRow.id}`}
            open={open === "detail"}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentRow(null);
                }, 300);
              }
            }}
            currentRow={currentRow}
          />

          <AccessoriesDeleteDialog
            key={`accessories-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null);
                setTimeout(() => {
                  setCurrentRow(null);
                }, 300);
              }
            }}
            // @ts-expect-error type
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
