"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ColumnsIcon,
  LoaderIcon,
} from "lucide-react";
import axios from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { z } from "zod";
import { AddPembayaranSheet} from "./AddPembayaranSheet";
import { IconPlus } from "@tabler/icons-react";

export const pembayaranSchema = z.object({
  id: z.number(),
  penghuni_rumah_id: z.number(),
  iuran_id: z.number(),
  periode_bulan: z.string(),
  tanggal_bayar: z.string(),
  jumlah_bulan: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  iuran: z.object({
    id: z.number(),
    nama: z.string(),
    jumlah: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
  penghuni_rumah: z.object({
    id: z.number(),
    rumah_id: z.number(),
    penghuni_id: z.number(),
    tanggal_mulai: z.string(),
    tanggal_selesai: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    penghuni: z.object({
      id: z.number(),
      nama_lengkap: z.string(),
      foto_ktp: z.string(),
      status_penghuni: z.string(),
      nomor_telepon: z.string(),
      status_pernikahan: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
    rumah: z.object({
      id: z.number(),
      nomor_rumah: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
  }),
});

const columns: ColumnDef<z.infer<typeof pembayaranSchema>>[] = [
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
    accessorKey: "nama_lengkap",
    header: "Nama Penghuni",
    cell: ({ row }) => {
      return row.original.penghuni_rumah.penghuni.nama_lengkap;
    },
  },
  {
    accessorKey: "penghuni_rumah.rumah.nomor_rumah",
    header: "Nomor Rumah",
    cell: ({ row }) => {
      return row.original.penghuni_rumah.rumah.nomor_rumah;
    },
  },
  {
    accessorKey: "tanggal_bayar",
    header: "Tanggal Bayar",
    cell: ({ row }) => {
      return format(new Date(row.original.tanggal_bayar), "dd MMMM yyyy", {
        locale: id,
      });
    },
  },
  {
    accessorKey: "iuran.nama",
    header: "Jenis Iuran",
    cell: ({ row }) => {
      return row.original.iuran.nama;
    },
  },
  {
    accessorKey: "iuran.jumlah",
    header: "Jumlah",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(row.original.iuran.jumlah));
    },
  },
  {
    accessorKey: "periode_bulan",
    header: "Periode",
    cell: ({ row }) => {
      return format(new Date(row.original.periode_bulan), "MMMM yyyy", {
        locale: id,
      });
    },
  },
  {
    accessorKey: "jumlah_bulan",
    header: "Jumlah Bulan",
    cell: ({ row }) => {
      return `${row.original.jumlah_bulan} Bulan`;
    },
  },
];

export function PembayaranDataTable() {
  const [data, setData] = React.useState<z.infer<typeof pembayaranSchema>[]>(
    []
  );
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
    pageSize: 30,
  });

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/pembayaran");
        const result = response.data;

        setData(result.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          placeholder="Cari nama penghuni..."
          value={
            (table.getColumn("nama_lengkap")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("nama_lengkap")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
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
          <AddPembayaranSheet>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Pembayaran
            </Button>
          </AddPembayaranSheet>
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
                  Tidak ada data pembayaran
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
