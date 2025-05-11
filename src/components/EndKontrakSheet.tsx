import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, LoaderIcon } from "lucide-react";
// import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
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

export function EndKontrakSheet({ rumah, penghuni, children }: { 
  rumah: z.infer<typeof rumahSchema>;
  penghuni: any;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tanggalSelesai, setTanggalSelesai] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalSelesai) {
      toast.error('Harap pilih tanggal selesai');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/rumah/${rumah.id}/selesaikan-kontrak`, {
        penghuni_rumah_id: penghuni.id,
        tanggal_selesai: format(tanggalSelesai, 'yyyy-MM-dd'),
      });
      
      toast.success('Kontrak berhasil diselesaikan');
      setOpen(false);
      // You might want to refresh the table data here
    } catch (error) {
      console.error('Failed to end contract:', error);
      toast.error('Gagal menyelesaikan kontrak');
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
          <SheetTitle>Selesaikan Kontrak</SheetTitle>
          <SheetDescription>
            Akhiri masa tinggal penghuni di rumah ini
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <p className="font-medium">Penghuni:</p>
            <p>{penghuni.penghuni.nama_lengkap}</p>
          </div>
          
          <div className="mb-4">
            <p className="font-medium">Rumah:</p>
            <p>No. {rumah.nomor_rumah}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tanggal_selesai" className="text-right">
                Tanggal Selesai
              </Label>
              <Calendar
                selected={tanggalSelesai}
                onSelect={setTanggalSelesai}
                className="col-span-3"
              />
              <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !tanggalSelesai && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {tanggalSelesai ? format(tanggalSelesai, "PPP") : <span>Pick a date</span>}
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
            
            <SheetFooter>
              <Button type="submit" disabled={loading} variant="destructive">
                {loading ? <LoaderIcon className="animate-spin mr-2" /> : null}
                Selesaikan Kontrak
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}