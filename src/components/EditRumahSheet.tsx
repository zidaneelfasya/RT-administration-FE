import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { LoaderIcon } from "lucide-react";

const rumahSchema = z.object({
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

export function EditRumahSheet({
  rumah,
  children,
  onSuccess,
}: {
  rumah: z.infer<typeof rumahSchema>;
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomor_rumah: rumah.nomor_rumah,
  });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // Check if the form data has changed from the original
    setIsChanged(formData.nomor_rumah !== rumah.nomor_rumah);
  }, [formData, rumah.nomor_rumah]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {

    console.log(formData, rumah.id)
    e.preventDefault();
    
    if (!isChanged) {
      toast.info('Tidak ada perubahan yang dilakukan');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/rumah/${rumah.id}`, formData);
      toast.success('Data rumah berhasil diperbarui');
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to update rumah:', error);
      toast.error('Gagal memperbarui data rumah');
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
          <SheetTitle>Edit Rumah No. {rumah.nomor_rumah}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomor_rumah" className="text-left">
              Nomor Rumah / Alamat
            </Label>
            <Input
              id="nomor_rumah"
              name="nomor_rumah"
              value={formData.nomor_rumah}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Status
            </Label>
            <Badge 
              variant={rumah.status_penghuni === "dihuni" ? "default" : "secondary"}
              className="col-span-3 w-fit"
            >
              {rumah.status_penghuni === "dihuni" ? "Dihuni" : "Tidak Dihuni"}
            </Badge>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">
              Penghuni Aktif
            </Label>
            <div className="col-span-3 space-y-2">
              {rumah.penghuni_rumah.filter(pr => pr.tanggal_selesai === null).length > 0 ? (
                rumah.penghuni_rumah
                  .filter(pr => pr.tanggal_selesai === null)
                  .map(pr => (
                    <div key={pr.id} className="p-3 border rounded-md">
                      <p className="font-medium">{pr.penghuni.nama_lengkap}</p>
                      <Badge 
                        variant={pr.penghuni.status_penghuni === "tetap" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {pr.penghuni.status_penghuni === "tetap" ? "Tetap" : "Kontrak"}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada penghuni aktif</p>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button 
              type="submit" 
              disabled={!isChanged || loading}
            >
              {loading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : 'Perbarui'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}