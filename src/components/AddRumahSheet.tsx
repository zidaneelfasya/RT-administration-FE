"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { LoaderIcon } from "lucide-react";

export function AddRumahSheet({
  children,
  onSuccess,
}: {
  children: React.ReactNode;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nomorRumah, setNomorRumah] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomorRumah.trim()) {
      toast.error("Nomor rumah tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/rumah", {
        nomor_rumah: nomorRumah,
      });

      toast.success("Rumah berhasil ditambahkan");
      setOpen(false);
      setNomorRumah("");
      if (onSuccess) onSuccess();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to add rumah:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal menambahkan rumah";
      toast.error(errorMessage);
    } finally {
      setLoading(false);

    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Tambah Rumah Baru</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4 px-5">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomor_rumah" className="text-start">
              Nomor Rumah / Alamat
            </Label>
            <Input
              id="nomor_rumah"
              value={nomorRumah}
              onChange={(e) => setNomorRumah(e.target.value)}
              className="col-span-3"
              placeholder="Masukkan nomor rumah"
            />
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading || !nomorRumah.trim()}>
              {loading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
