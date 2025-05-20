"use client";

import * as React from "react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PenghuniDetailView from "./PenghuniDetailView";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ColumnsIcon,
  LoaderIcon,
  MoreVerticalIcon,
} from "lucide-react";
import axios from "@/lib/axios";
import { AddPenghuniSheet } from "./AddPenghuniSheet";
import { EndKontrakSheet } from "./EndKontrakSheet";
import { RumahDetailView } from "./RumahDetailView";
import { EditRumahSheet } from "./EditRumahSheet";
import { AddRumahSheet } from "./AddRumahSheet";

export const rumahSchema = z.object({
  id: z.number(),
  nomor_rumah: z.string(),
  status_penghuni: z.enum(["dihuni", "tidak_dihuni"]),
  penghuni_rumah: z.array(
    z.object({
      id: z.number(),
      penghuni: z.object({
        id: z.number(),
        nama_lengkap: z.string(),
        status_penghuni: z.enum(["tetap", "kontrak"]),
      }),
      tanggal_mulai: z.string(),
      tanggal_selesai: z.string().nullable(),
    })
  ),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

export function RumahDataTable() {
  const [data, setData] = React.useState<z.infer<typeof rumahSchema>[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [addPenghuniOpen, setAddPenghuniOpen] = React.useState(false);
  const [endKontrakOpen, setEndKontrakOpen] = React.useState(false);
  const [selectedRumah, setSelectedRumah] = React.useState<{
    id: number;
    penghuniAktifId?: number;
  } | null>(null);

  const handleAddPenghuni = (rumahId: number) => {
    setSelectedRumah({ id: rumahId });
    setAddPenghuniOpen(true);
  };

  const handleEndKontrak = (rumahId: number, penghuniRumahId: number) => {
    setSelectedRumah({ id: rumahId, penghuniAktifId: penghuniRumahId });
    setEndKontrakOpen(true);
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.get("/api/", {
        params: {
          with: "penghuniRumah.penghuni", // Include penghuni data
        },
      });
      const result = response.data;
      setData(result.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data rumah");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleRefresh = () => {
    // Implementasi refresh data
    fetchData();
  };

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/rumah", {
          params: {
            with: "penghuniRumah.penghuni", // Include penghuni data
          },
        });
        const result = response.data;
        setData(result.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Gagal memuat data rumah");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isDihuni = (penghuniRumah: any[]) => {
    return penghuniRumah.some(pr => pr.tanggal_selesai === null );
  };

  const columns: ColumnDef<z.infer<typeof rumahSchema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nomor_rumah",
      header: "Nomor Rumah(alamat)",
      cell: ({ row }) => {
        return (
          <span className="font-medium">No. {row.original.nomor_rumah}</span>
        );
      },
    },
    {
      accessorKey: "status_penghuni",
      header: "Status",
      cell: ({ row }) => {
        const isOccupied = isDihuni(row.original.penghuni_rumah);
        return (
          <Badge variant={isOccupied ? "default" : "secondary"}>
            {isOccupied ? "Dihuni" : "Tidak Dihuni"}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const isOccupied = isDihuni(row.original.penghuni_rumah);
        return value.includes(isOccupied ? "dihuni" : "tidak_dihuni");
      },
    },
    // {
    //   accessorKey: "penghuni_rumah",
    //   header: "Penghuni",
    //   cell: ({ row }) => {
    //     const penghuniAktif = row.original.penghuni_rumah.find(
    //       (pr) => pr.tanggal_selesai === null
    //     );

    //     if (!penghuniAktif) return "-";

    //     return (
    //       <div className="flex flex-col">
    //         <span>{penghuniAktif.penghuni.nama_lengkap}</span>
    //         <span className="text-xs text-muted-foreground">
    //           {penghuniAktif.penghuni.status_penghuni === "tetap"
    //             ? "Penghuni Tetap"
    //             : "Penghuni Kontrak"}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
    {
      id: "history",
      header: "Riwayat Penghuni",
      cell: ({ row }) => {
        const penghuniList = row.original.penghuni_rumah;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Lihat Riwayat ({penghuniList.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {penghuniList.map((pr) => (
                <DropdownMenuItem
                  key={pr.id}
                  className="flex flex-col items-start"
                >
                  <span className="font-medium">
                    {pr.penghuni.nama_lengkap}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(pr.tanggal_mulai).toLocaleDateString()} -{" "}
                    {pr.tanggal_selesai
                      ? new Date(pr.tanggal_selesai).toLocaleDateString()
                      : "Sekarang"}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "action",
      header: "action",
      cell: ({ row }) => {
        return (
          <RumahDetailView rumah={row.original}>
            <span className="font-medium">Detail</span>
          </RumahDetailView>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rumah = row.original;
        const penghuniAktif = rumah.penghuni_rumah.find(
          (pr) => pr.tanggal_selesai === null
        );

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(rumah.id.toString())
                }
              >
                Salin ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <AddPenghuniSheet rumah={rumah}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Tambah Penghuni
                </DropdownMenuItem>
              </AddPenghuniSheet>

              <EditRumahSheet
                rumah={rumah}
                onSuccess={() => {
                  // Refresh your table data here
                  fetchData();
                }}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit Rumah
                </DropdownMenuItem>
              </EditRumahSheet>
              
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderIcon className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 m-6">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Cari nomor rumah..."
          value={
            (table.getColumn("nomor_rumah")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nomor_rumah")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ColumnsIcon className="mr-2 h-4 w-4" />
                Kolom
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <AddRumahSheet
           
          >
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Rumah
            </Button>
          </AddRumahSheet>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data rumah
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} dari{" "}
          {table.getFilteredRowModel().rows.length} baris terpilih
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Baris per halaman</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
