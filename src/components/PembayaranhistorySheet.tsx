"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LoaderIcon } from "lucide-react";

interface PaymentHistory {
  [month: string]: {
    [category: string]: string;
  };
}

export function PembayaranHistorySheet({
  penghuniId,
  children,
}: {
  penghuniId: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PaymentHistory>({});

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/pembayaran/${penghuniId}/rekap`);
      setHistory(response.data.data);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      toast.error("Gagal memuat riwayat pembayaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPaymentHistory();
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Riwayat Pembayaran</SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-6 px-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoaderIcon className="animate-spin" />
            </div>
          ) : Object.keys(history).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(history).map(([month, payments]) => (
                <div key={month} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">{month}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(payments).map(([category, status]) => (
                      <div key={category} className="flex items-center gap-2">
                        <span className="text-sm">{category}:</span>
                        <Badge
                          variant={
                            status.includes("✅") ? "default" : "destructive"
                          }
                        >
                          {status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada riwayat pembayaran
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}