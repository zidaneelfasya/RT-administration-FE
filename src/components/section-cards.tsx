"use client"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Fungsi utilitas untuk memformat mata uang
const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `Rp ${num.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
};

export function SectionCards() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`/api/reports/monthly/${year}`)
        setData(response.data.data)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Gagal memuat data. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year])

  const monthData = data?.find((item: any) => item.bulan === selectedMonth)
  const previousMonthData = data?.find((item: any) => item.bulan === (selectedMonth - 1 || 12))

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  const calculateTrend = (current: number, previous: number) => {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const pemasukanTrend = monthData && previousMonthData 
    ? calculateTrend(parseFloat(monthData.pemasukan), parseFloat(previousMonthData.pemasukan)) 
    : 0
  const pengeluaranTrend = monthData && previousMonthData 
    ? calculateTrend(parseFloat(monthData.pengeluaran), parseFloat(previousMonthData.pengeluaran)) 
    : 0
  const saldoTrend = monthData && previousMonthData 
    ? calculateTrend(monthData.saldo, previousMonthData.saldo) 
    : 0

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="animate-pulse h-[150px] @container/card" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Error</CardDescription>
            <CardTitle className="text-red-500">{error}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Month/Year Selector */}
      <div className="@container/card col-span-full">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardDescription>Periode Laporan</CardDescription>
              <CardTitle className="text-xl">{monthNames[selectedMonth - 1]} {year}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedMonth.toString()} 
                onValueChange={(v) => setSelectedMonth(parseInt(v))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={month} value={`${index + 1}`}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={year.toString()} 
                onValueChange={(v) => setYear(parseInt(v))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({length: 5}, (_, i) => year - 2 + i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Pemasukan Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pemasukan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(monthData?.pemasukan || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={pemasukanTrend >= 0 ? "text-green-500" : "text-red-500"}>
              {pemasukanTrend >= 0 ? <IconTrendingUp className="mr-1" /> : <IconTrendingDown className="mr-1" />}
              {Math.abs(pemasukanTrend).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pemasukanTrend >= 0 ? "Meningkat" : "Menurun"} dari bulan lalu
            {pemasukanTrend >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Periode {monthNames[selectedMonth - 1]} {year}
          </div>
        </CardFooter>
      </Card>

      {/* Pengeluaran Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pengeluaran</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(monthData?.pengeluaran || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={pengeluaranTrend >= 0 ? "text-red-500" : "text-green-500"}>
              {pengeluaranTrend >= 0 ? <IconTrendingUp className="mr-1" /> : <IconTrendingDown className="mr-1" />}
              {Math.abs(pengeluaranTrend).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {pengeluaranTrend >= 0 ? "Meningkat" : "Menurun"} dari bulan lalu
            {pengeluaranTrend >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Periode {monthNames[selectedMonth - 1]} {year}
          </div>
        </CardFooter>
      </Card>

      {/* Saldo Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Saldo</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(monthData?.saldo || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={saldoTrend >= 0 ? "text-green-500" : "text-red-500"}>
              {saldoTrend >= 0 ? <IconTrendingUp className="mr-1" /> : <IconTrendingDown className="mr-1" />}
              {Math.abs(saldoTrend).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {saldoTrend >= 0 ? "Meningkat" : "Menurun"} dari bulan lalu
            {saldoTrend >= 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Akumulasi hingga {monthNames[selectedMonth - 1]} {year}
          </div>
        </CardFooter>
      </Card>

      {/* Summary Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ringkasan</CardDescription>
          <CardTitle className="text-xl">Performa Bulan Ini</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex justify-between w-full">
            <span className="text-muted-foreground">Pemasukan:</span>
            <span className="font-medium text-green-500">
              {formatCurrency(monthData?.pemasukan || 0)}
            </span>
          </div>
          <div className="flex justify-between w-full">
            <span className="text-muted-foreground">Pengeluaran:</span>
            <span className="font-medium text-red-500">
              {formatCurrency(monthData?.pengeluaran || 0)}
            </span>
          </div>
          <div className="flex justify-between w-full pt-2 border-t">
            <span className="text-muted-foreground">Saldo Akhir:</span>
            <span className="font-medium text-blue-500">
              {formatCurrency(monthData?.saldo || 0)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}