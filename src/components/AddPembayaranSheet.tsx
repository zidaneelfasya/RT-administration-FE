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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { z } from "zod";

const penghuniSchema = z.object({
  id: z.number(),
  nama_lengkap: z.string(),
  status_penghuni: z.enum(["tetap", "kontrak"]),
  penghuni_rumah: z.array(
    z.object({
      id: z.number(),
      rumah: z.object({
        id: z.number(),
        nomor_rumah: z.string(),
      }),
    })
  ),
});

const iuranSchema = z.object({
  id: z.number(),
  nama: z.string(),
  jumlah: z.string(),
});

export function AddPembayaranSheet({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [penghuniOptions, setPenghuniOptions] = useState<z.infer<typeof penghuniSchema>[]>([]);
  const [iuranOptions, setIuranOptions] = useState<z.infer<typeof iuranSchema>[]>([]);
  const [selectedPenghuni, setSelectedPenghuni] = useState<number | null>(null);

  const [selectedIuran, setSelectedIuran] = useState<string>("");
  const [tanggalBayar, setTanggalBayar] = useState<Date>(new Date());
  const [periodeBulan, setPeriodeBulan] = useState<Date>(new Date());
  const [jumlahBulan, setJumlahBulan] = useState<number>(1);

  // Fetch penghuni and iuran data when sheet opens
  useEffect(() => {
    if (open) {
      fetchPenghuni();
      fetchIuran();
    }
  }, [open]);

  const fetchPenghuni = async () => {
    try {
      const response = await axios.get("/api/penghuni/get");
      setPenghuniOptions(response.data);

    } catch (error) {
      console.error("Failed to fetch penghuni:", error);
      toast.error("Gagal memuat data penghuni");
    }
  };

  const fetchIuran = async () => {
    try {
      const response = await axios.get("/api/iuran");
      setIuranOptions(response.data);

    } catch (error) {
      console.error("Failed to fetch iuran:", error);
      toast.error("Gagal memuat data iuran");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(selectedPenghuni, selectedIuran, format(tanggalBayar, "yyyy-MM-dd"), format(periodeBulan, "yyyy-MM-01"), jumlahBulan);
   

    e.preventDefault();
    
    if (!selectedPenghuni || !selectedIuran || !tanggalBayar || !periodeBulan || !jumlahBulan) {
      toast.error("Harap lengkapi semua field");
      return;
    }

    setLoading(true);
    try {
      
      const response = await axios.post("/api/pembayaran/store", {
        penghuni_rumah_id: selectedPenghuni,
        iuran_id: selectedIuran,
        tanggal_bayar: format(tanggalBayar, "yyyy-MM-dd"),
        periode_bulan: format(periodeBulan, "yyyy-MM-01"),
        jumlah_bulan: jumlahBulan,
      });

      toast.success("Pembayaran berhasil ditambahkan");
      setOpen(false);
      // Refresh the page or update state as needed
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to add pembayaran:", error);
      toast.error(error.response?.data?.message || "Gagal menambahkan pembayaran");
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
          <SheetTitle>Tambah Pembayaran</SheetTitle>
          <SheetDescription>
            Tambahkan data pembayaran baru untuk penghuni
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4 px-4">
          {/* Penghuni Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="penghuni" className="text-right">
              Penghuni
            </Label>
            <Select
              value={selectedPenghuni?.toString() || ""}
              onValueChange={(value) => setSelectedPenghuni(Number(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih penghuni" />
              </SelectTrigger>
              <SelectContent>
                {penghuniOptions.map((penghuni) => (
                  <SelectItem key={penghuni.id} value={penghuni.id.toString()}>
                    {penghuni.nama_lengkap} ({penghuni.status_penghuni})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="penghuni" className="text-right">
              Iuran
            </Label>
            <Select
              value={selectedIuran}
              onValueChange={setSelectedIuran}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih penghuni" />
              </SelectTrigger>
              <SelectContent>
                {iuranOptions.map((iuran) => (
                  <SelectItem key={iuran.id} value={iuran.id.toString()}>
                    {iuran.nama} (Rp {new Intl.NumberFormat("id-ID").format(Number(iuran.jumlah))})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Iuran Select */}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iuran" className="text-right">
              Jenis Iuran
            </Label>
            <Select
              value={selectedIuran}
              onValueChange={setSelectedIuran}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih jenis iuran" />
              </SelectTrigger>
              <SelectContent>
                {iuranOptions.map((iuran) => (
                  <SelectItem key={iuran.id} value={iuran.id.toString()}>
                    {iuran.nama} (Rp {new Intl.NumberFormat("id-ID").format(Number(iuran.jumlah))})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Tanggal Bayar */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tanggal_bayar" className="text-right">
              Tanggal Bayar
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !tanggalBayar && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalBayar ? (
                    format(tanggalBayar, "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggalBayar}
                  onSelect={(date) => date && setTanggalBayar(date)}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Periode Bulan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="periode_bulan" className="text-right">
              Periode Bulan
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !periodeBulan && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {periodeBulan ? (
                    format(periodeBulan, "MMMM yyyy", { locale: id })
                  ) : (
                    <span>Pilih bulan</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={periodeBulan}
                  onSelect={(date) => date && setPeriodeBulan(date)}
                  initialFocus
                  locale={id}
                  captionLayout="dropdown" // Enables month/year dropdowns
                  fromYear={2000} // Optional: Limit the year range
                  toYear={2030}  
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Jumlah Bulan */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jumlah_bulan" className="text-right">
              Jumlah Bulan
            </Label>
            <Input
              id="jumlah_bulan"
              type="number"
              min="1"
              value={jumlahBulan}
              onChange={(e) => setJumlahBulan(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Pembayaran
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}