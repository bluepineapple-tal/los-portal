"use client";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
} from "lucide-react";
import * as React from "react";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { LoanOfferDTO } from "../loan-offers/loan-offer.schema";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

/* -------------------------------------------------------------------------- */
/*                                PUBLIC TYPES                                */
/* -------------------------------------------------------------------------- */

export interface DataTableProps<TData extends object> {
  /** Data to render. */
  data: TData[];
  /** Column definition array (tanstack ColumnDef<TData>[]) */
  columns: ColumnDef<TData, unknown>[];
  /** Unique ID accessor – defaults to `(row) => row.id` */
  getRowId?: (row: TData) => UniqueIdentifier;
  /** Optional controlled visibility state (or default state for uncontrolled). */
  initialVisibility?: VisibilityState;
  /** Page-size options shown to the user. */
  pageSizes?: number[];
  /**
   * Called when the user re-orders rows via drag-and-drop.
   * Return value is the new *data* array to persist (so you can hit an API).
   * If omitted, row order is only updated client-side.
   */
  onReorder?: (prev: TData[], next: TData[]) => TData[] | void;
  /** Anything you want reachable at table.options.meta */
  meta?: Record<string, unknown>;
}

type RowDetailRenderer<T> = (row: T) => React.ReactNode;

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    /** If truthy this cell becomes the clickable trigger            */
    detailTrigger?: boolean;
    /** What to render inside the Sheet / Drawer when opened         */
    detailRenderer?: RowDetailRenderer<TData>;
    /** Setter that opens the global edit drawer in LoanOfferList */
    setEditing?: (offer: LoanOfferDTO) => void;
  }
}

/* -------------------------------------------------------------------------- */
/*                         INTERNAL DRAG-HANDLE COMPONENT                     */
/* -------------------------------------------------------------------------- */

function DragHandle({ id }: Readonly<{ id: UniqueIdentifier }>) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-6 text-muted-foreground hover:bg-transparent"
    >
      <GripVerticalIcon className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN TABLE                                  */
/* -------------------------------------------------------------------------- */

export function DataTable<TData extends object>({
  data: initial,
  columns: userColumns,
  meta,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRowId = (row: any) => row.id as unknown as UniqueIdentifier,
  pageSizes = [10, 20, 30, 40, 50],
  initialVisibility = {},
  onReorder,
}: Readonly<DataTableProps<TData>>) {
  /* ----------------------------- State & refs ----------------------------- */

  const [data, setData] = React.useState(initial);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSizes[0],
  });

  /* ----------------------------- Sensors (DnD) ---------------------------- */

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const ids = React.useMemo<UniqueIdentifier[]>(
    () => data.map(getRowId),
    [data, getRowId],
  );

  /* ------------------------- Column augmentation ------------------------- */
  /* We inject the drag-handle & checkbox columns *once* so users don’t have  */
  /* to include them every time.                                             */

  const columns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    const dragCol: ColumnDef<TData> = {
      id: "_drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={getRowId(row.original)} />,
      enableSorting: false,
      enableHiding: false,
    };

    const selectCol: ColumnDef<TData> = {
      id: "_select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [dragCol, selectCol, ...userColumns];
  }, [userColumns, getRowId]);

  /* ------------------------- Table instance (TanStack) ------------------------- */

  const table = useReactTable({
    data,
    columns,
    meta,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    getRowId: (row) => getRowId(row).toString(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  /* ------------------------------- DnD logic ------------------------------ */

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((old) => {
        const oldIdx = ids.indexOf(active.id);
        const newIdx = ids.indexOf(over.id);
        const next = arrayMove(old, oldIdx, newIdx);

        onReorder?.(old, next); // let the parent persist if desired
        return next;
      });
    }
  }

  /* --------------------------- Render helpers ---------------------------- */

  /* Helper that wraps a cell with a <Sheet> when meta.detailTrigger === true */
  function CellWithOptionalDetail<T>({
    cell,
    row,
  }: Readonly<{
    cell: ReturnType<Row<T>["getVisibleCells"]>[number];
    row: Row<T>;
  }>) {
    const meta = cell.column.columnDef.meta;
    const content = flexRender(cell.column.columnDef.cell, cell.getContext());

    if (meta?.detailTrigger && meta?.detailRenderer) {
      return (
        <DetailSheet trigger={content}>
          {meta.detailRenderer(row.original)}
        </DetailSheet>
      );
    }

    return content;
  }

  /* Simple composable Sheet/Drawer wrapper */
  function DetailSheet({
    trigger,
    children,
  }: Readonly<{
    trigger: React.ReactNode;
    children: React.ReactNode;
  }>) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant={"link"}
            className="w-fit px-0 text-left text-foreground"
          >
            {trigger}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col gap-6">
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  function DraggableRow<TData>({ row }: Readonly<{ row: Row<TData> }>) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.id,
    });

    return (
      <TableRow
        ref={setNodeRef}
        data-dragging={isDragging}
        data-state={row.getIsSelected() && "selected"}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {/* 👇 swap flexRender for wrapper */}
            <CellWithOptionalDetail cell={cell} row={row} />
          </TableCell>
        ))}
      </TableRow>
    );
  }

  /* -------------------------------- UI ----------------------------------- */

  return (
    <div className="flex w-full flex-col gap-6">
      {/* ---------- Toolbar ---------- */}
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ColumnsIcon width={16} height={16} />
              <span className="hidden lg:inline lg:ml-1">
                Customize columns
              </span>
              <span className="lg:hidden">Columns</span>
              <ChevronDownIcon width={16} height={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 max-h-64 overflow-y-auto"
          >
            {table
              .getAllColumns()
              .filter(
                (c) => typeof c.accessorFn !== "undefined" && c.getCanHide(),
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.replace(/_/g, " ")}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* 👇 Slot for any extra controls (e.g., Add Section button) */}
        <div id="advanced-table-toolbar-slot" />
      </div>

      {/* ---------- Table ---------- */}
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                <SortableContext
                  items={ids}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* ---------- Pagination ---------- */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-4">
        <div className="hidden text-sm text-muted-foreground lg:block">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>

        <div className="flex items-center gap-8">
          {/* Rows-per-page selector */}
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page">Rows per page</Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger id="rows-per-page" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page indicator */}
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          {/* Paging buttons */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">First</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Last</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
