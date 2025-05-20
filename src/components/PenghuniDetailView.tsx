
import { useState, useEffect } from "react";

import { z } from "zod";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/router";

const penghuniSchema = z.object({
  id: z.number(),
  nama_lengkap: z.string(),
  foto_ktp: z.string().nullable(),
  status_penghuni: z.enum(["tetap", "kontrak"]),
  nomor_telepon: z.string(),
  status_pernikahan: z.enum(["menikah", "belum_menikah"]),
  rumah: z
    .array(
      z.object({
        nomor_rumah: z.string(),
        tanggal_mulai: z.string(),
        tanggal_selesai: z.string().nullable(),
      })
    )
    .optional(),
});

function PenghuniDetailView({
  penghuni,
  onUpdate,
}: {
  penghuni: z.infer<typeof penghuniSchema>;
  onUpdate?: () => void;
}) {
  
  const BASE_URL = "http://localhost:8000";
  const fullImageUrl = `${BASE_URL}/storage/${penghuni.foto_ktp}`;
  

  const [formData, setFormData] = useState({
    nama_lengkap: penghuni.nama_lengkap,
    status_penghuni: penghuni.status_penghuni,
    nomor_telepon: penghuni.nomor_telepon,
    status_pernikahan: penghuni.status_pernikahan,
  });

  const [isChanged, setIsChanged] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const hasChanged =
      formData.nama_lengkap !== penghuni.nama_lengkap ||
      formData.status_penghuni !== penghuni.status_penghuni ||
      formData.nomor_telepon !== penghuni.nomor_telepon ||
      formData.status_pernikahan !== penghuni.status_pernikahan;

    setIsChanged(hasChanged);
  }, [formData, penghuni]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/penghuni/${penghuni.id}`, formData);
      toast("Data penghuni berhasil diperbarui");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating penghuni:", error);
      toast("Terjadi kesalahan saat memperbarui data");
    } finally {
      setIsUpdating(false);
      window.location.reload();
    }
  };

  const handleUpdateKtp = () => {
    console.log("file", fullImageUrl)
    window.location.href = `/penghuni/${penghuni.id}/update-ktp`; // Adjust the route as needed
    // route.push(`/penghuni/${penghuni.id}/update-ktp`); // Adjust the route as needed
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          Detail
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Detail Penghuni</SheetTitle>
          <SheetDescription>
            Informasi lengkap tentang penghuni
          </SheetDescription>
        </SheetHeader>


        <div className="grid gap-4 py-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nama" className="text-right">
              Nama Lengkap
            </Label>
            <Input
              id="nama"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              ID
            </Label>
            <Input
              id="id"
              value={penghuni.id}
              className="col-span-3"
              readOnly
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status_penghuni" className="text-right">
              Status Penghuni
            </Label>
            <Select
              value={formData.status_penghuni}
              onValueChange={(value) =>
                handleSelectChange("status_penghuni", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tetap">Tetap</SelectItem>
                <SelectItem value="kontrak">Kontrak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {penghuni.foto_ktp && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Foto KTP</Label>
              <div className="col-span-3 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={fullImageUrl}
                    alt="Foto KTP"
                    className="h-32 rounded-md object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUpdateKtp}
                >
                  Ganti Foto
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomor_telepon" className="text-right">
              Nomor Telepon
            </Label>
            <Input
              id="nomor_telepon"
              name="nomor_telepon"
              value={formData.nomor_telepon}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status_pernikahan" className="text-left">
              Status Pernikahan
            </Label>
            <Select
              value={formData.status_pernikahan}
              onValueChange={(value) =>
                handleSelectChange("status_pernikahan", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menikah">Menikah</SelectItem>
                <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {penghuni.rumah && penghuni.rumah.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Rumah</Label>
              <div className="col-span-3 space-y-2">
                {penghuni.rumah.map((rumah, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="font-medium">No. {rumah.nomor_rumah}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(rumah.tanggal_mulai).toLocaleDateString()} -{" "}
                      {rumah.tanggal_selesai
                        ? new Date(rumah.tanggal_selesai).toLocaleDateString()
                        : "Sekarang"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
        
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isChanged || isUpdating}
          >
            {isUpdating ? "Memperbarui..." : "Perbarui"}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Tutup
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default PenghuniDetailView;
