import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
// import { DatePicker } from "@/components/ui/date-picker";
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
} from "./ui/sheet";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { z } from "zod";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

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



export function AddPenghuniSheet({
  rumah,
  children,
}: {
  rumah: z.infer<typeof rumahSchema>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState<number | null>(null);
  const [tanggalMulai, setTanggalMulai] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const [penghuniOptions, setPenghuniOptions] = useState<any[]>([]);

  const fetchPenghuni = async () => {
    try {
      const response = await axios.get("/api/penghuni/get");
      setPenghuniOptions(response.data);
    } catch (error) {
      console.error("Failed to fetch penghuni:", error);
      toast.error("Gagal memuat data penghuni");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPenghuni || !tanggalMulai) {
      toast.error("Harap pilih penghuni dan tanggal mulai");
      return;
    }
    console.log(rumah.id, selectedPenghuni, format(tanggalMulai, "yyyy-MM-dd"));

    setLoading(true);
    try {
      await axios.post(`/api/rumah/tambah-penghuni`, {
        rumah_id: rumah.id,
        penghuni_id: selectedPenghuni,
        tanggal_mulai: format(tanggalMulai, "yyyy-MM-dd"),
      });

      toast.success("Penghuni berhasil ditambahkan");
      setOpen(false);
      // You might want to refresh the table data here
    } catch (error) {
      console.error("Failed to add penghuni:", error);
      toast.error("Gagal menambahkan penghuni");
    } finally {
      
      
      setLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild onClick={() => fetchPenghuni()}>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            Tambah Penghuni ke Rumah No. {rumah.nomor_rumah}
          </SheetTitle>
          <SheetDescription>
            Tambahkan penghuni baru ke rumah ini
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4 px-4">
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

          <div className="grid grid-cols-4 items-center gap-4 ">
            <Label htmlFor="tanggal_mulai" className="text-right">
              Tanggal Mulai
            </Label>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !tanggalMulai && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {tanggalMulai ? format(tanggalMulai, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggalMulai}
                  onSelect={setTanggalMulai}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderIcon className="animate-spin mr-2" /> : null}
              Simpan
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
