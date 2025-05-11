"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "@/lib/axios";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { IconPlus } from "@tabler/icons-react";

export function AddPengeluaranSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [deskripsi, setDeskripsi] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [kategori, setKategori] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tanggal || !deskripsi || !jumlah || !kategori) {
      toast.error("Harap lengkapi semua field");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/pengeluaran", {
        deskripsi,
        jumlah,
        tanggal: format(tanggal, "yyyy-MM-dd"),
        kategori,
      });

      toast.success("Pengeluaran berhasil ditambahkan");
      setOpen(false);
      // Refresh the page or update state as needed
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to add pengeluaran:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan pengeluaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Tambah Pengeluaran</SheetTitle>
          <SheetDescription>
            Tambahkan data pengeluaran baru
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4 px-4">
          {/* Tanggal */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal" className="text-right">
              Tanggal
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !tanggal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggal ? (
                    format(tanggal, "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggal}
                  onSelect={(date) => date && setTanggal(date)}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Kategori */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kategori" className="text-right">
              Kategori
            </Label>
            <Input
              id="kategori"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan kategori pengeluaran"
            />
          </div>

          {/* Deskripsi */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deskripsi" className="text-right">
              Deskripsi
            </Label>
            <Input
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan deskripsi pengeluaran"
            />
          </div>

          {/* Jumlah */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jumlah" className="text-right">
              Jumlah
            </Label>
            <Input
              id="jumlah"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan jumlah pengeluaran"
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Pengeluaran
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}