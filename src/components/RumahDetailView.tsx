// components/RumahDetailView.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, LoaderIcon, MoreVerticalIcon } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { ReactNode, useEffect, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { z } from "zod";

const rumahSchema = z.object({
  id: z.number(),
  nomor_rumah: z.string(),
  status_penghuni: z.enum(["dihuni", "tidak_dihuni"]),
});

type RumahType = z.infer<typeof rumahSchema>;

interface RumahDetailViewProps {
  rumah: RumahType;
  children: ReactNode;
}

interface PenghuniRumahType {
  id: number;
  penghuni: {
    id: number;
    nama_lengkap: string;
    status_penghuni: "tetap" | "kontrak";
  };
  tanggal_mulai: string;
  tanggal_selesai: string | null;
}

export function RumahDetailView({ rumah, children }: RumahDetailViewProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPenghuniAktif, setLoadingPenghuniAktif] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [penghuniAktif, setPenghuniAktif] = useState<PenghuniRumahType[]>([]);
  const [riwayatPenghuni, setRiwayatPenghuni] = useState<PenghuniRumahType[]>([]);
  const [tanggalSelesai, setTanggalSelesai] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (open) {
      fetchPenghuniAktif();
      fetchRiwayatPenghuni();
    }
  }, [open]);

  const fetchPenghuniAktif = async () => {
    setLoadingPenghuniAktif(true);
    try {
      const response = await axios.get(`/api/rumah/${rumah.id}/penghuni-aktif`);
      setPenghuniAktif(response.data.data);
    } catch (error) {
      console.error("Failed to fetch penghuni aktif:", error);
      toast.error("Gagal memuat penghuni aktif");
    } finally {
      setLoadingPenghuniAktif(false);
    }
  };

  const fetchRiwayatPenghuni = async () => {
    setLoadingRiwayat(true);
    try {
      const response = await axios.get(`/api/rumah/${rumah.id}/riwayat-penghuni`);
      setRiwayatPenghuni(response.data.data);
    } catch (error) {
      console.error("Failed to fetch riwayat penghuni:", error);
      toast.error("Gagal memuat riwayat penghuni");
    } finally {
      setLoadingRiwayat(false);
    }
  };

  const handleSelesaikanKontrak = async (penghuniRumahId: number) => {
    if (!tanggalSelesai) {
      toast.error("Harap pilih tanggal selesai");
      return;
    }
    console.log(tanggalSelesai)
    setLoading(true);
    try {
      await axios.put(`/api/penghuni-rumah/${penghuniRumahId}/selesaikan`, {

        tanggal_selesai: format(tanggalSelesai, "yyyy-MM-dd"),
      });

      toast.success("Kontrak berhasil diselesaikan");
      await Promise.all([fetchPenghuniAktif(), fetchRiwayatPenghuni()]);
    } catch (error) {
      window.location.reload();
    } finally {
      setLoading(false);

    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          {children}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-background z-10">
          <SheetTitle>Detail Rumah No. {rumah.nomor_rumah}</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-6 px-6">
          {/* Current Status */}
          <div className="space-y-2">
            <h3 className="font-medium">Status Rumah</h3>
            <Badge
              variant={
                rumah.status_penghuni === "dihuni" ? "default" : "secondary"
              }
            >
              {rumah.status_penghuni === "dihuni" ? "Dihuni" : "Tidak Dihuni"}
            </Badge>
          </div>

          {/* Current Penghuni */}
          <div className="space-y-4">
            <div className="flex justify-between items-center sticky top-14 bg-background py-2 z-10">
              <h3 className="font-medium">Penghuni Aktif</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchPenghuniAktif}
                disabled={loadingPenghuniAktif}
              >
                {loadingPenghuniAktif ? "Memuat..." : "Refresh"}
              </Button>
            </div>
            
            {loadingPenghuniAktif ? (
              <div className="flex justify-center py-4">
                <LoaderIcon className="animate-spin" />
              </div>
            ) : penghuniAktif.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {penghuniAktif.map((pr) => (
                  <div key={pr.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{pr.penghuni.nama_lengkap}</p>
                        <Badge
                          variant={
                            pr.penghuni.status_penghuni === "tetap"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {pr.penghuni.status_penghuni === "tetap"
                            ? "Tetap"
                            : "Kontrak"}
                        </Badge>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleSelesaikanKontrak(pr.id)}
                        disabled={loading}
                      >
                        {loading ? "Memproses..." : "Selesaikan Kontrak"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                        <p>
                          {format(new Date(pr.tanggal_mulai), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tanggal Selesai
                        </p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !tanggalSelesai && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {tanggalSelesai ? (
                                format(tanggalSelesai, "PPP")
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={tanggalSelesai}
                              onSelect={setTanggalSelesai}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tidak ada penghuni aktif
              </p>
            )}
          </div>

          {/* Riwayat Penghuni */}
          <div className="space-y-4">
            <div className="flex justify-between items-center sticky top-14 bg-background py-2 z-10">
              <h3 className="font-medium">Riwayat Penghuni</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchRiwayatPenghuni}
                disabled={loadingRiwayat}
              >
                {loadingRiwayat ? "Memuat..." : "Refresh"}
              </Button>
            </div>
            {loadingRiwayat ? (
              <div className="flex justify-center py-4">
                <LoaderIcon className="animate-spin" />
              </div>
            ) : riwayatPenghuni.length > 0 ? (
              <div className="border rounded-lg divide-y max-h-[400px] overflow-y-auto">
                {riwayatPenghuni.map((pr) => (
                  <div key={pr.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {pr.penghuni.nama_lengkap}
                        </p>
                        <Badge
                          variant={
                            pr.penghuni.status_penghuni === "tetap"
                              ? "default"
                              : "secondary"
                          }
                          className="mt-1"
                        >
                          {pr.penghuni.status_penghuni === "tetap"
                            ? "Tetap"
                            : "Kontrak"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground text-right">
                        <p>
                          {format(new Date(pr.tanggal_mulai), "dd MMM yyyy")}
                        </p>
                        <p>sampai</p>
                        <p>
                          {pr.tanggal_selesai 
                            ? format(new Date(pr.tanggal_selesai), "dd MMM yyyy")
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Belum ada riwayat penghuni
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}