"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import axios from "@/lib/axios"

export const description = "An interactive area chart showing monthly income, expenses, and balance"

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#22c55e", // green-500
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444", // red-500
  },
  saldo: {
    label: "Saldo",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig

export function ChartMonthlyReport() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("12m")
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [error, setError] = React.useState<string | null>(null)

  const [visibleSeries, setVisibleSeries] = React.useState<Record<string, boolean>>({
    pemasukan: true,
    pengeluaran: true,
    saldo: true
  });

  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`/api/reports/monthly/${year}`)
        
        // Transform API data to match chart format
        const transformedData = response.data.data.map((item: any) => ({
          bulan: item.bulan,
          date: new Date(year, item.bulan - 1, 1).toISOString().split('T')[0],
          pemasukan: item.pemasukan,
          pengeluaran: item.pengeluaran,
          saldo: item.saldo
        }))
        
        setChartData(transformedData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Gagal memuat data. Silakan coba lagi.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("3m")
    }
  }, [isMobile])

  const filteredData = React.useMemo(() => {
    const latestData = chartData[chartData.length - 1];
    const latestDate = latestData ? new Date(latestData.date) : new Date(year, 11, 1); // Default: Dec
    
    const cutoffDate = new Date(latestDate);
    
    // Set cutoff date based on timeRange
    if (timeRange === "12m") {
      cutoffDate.setMonth(latestDate.getMonth() - 12);
    } else if (timeRange === "6m") {
      cutoffDate.setMonth(latestDate.getMonth() - 6); // 🔧 Perbaikan di sini
    } else {
      cutoffDate.setMonth(latestDate.getMonth() - 3);
    }
    
    return chartData
      .filter(item => new Date(item.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [chartData, timeRange]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Laporan Keuangan Bulanan</CardTitle>
          <CardDescription>Memuat data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Laporan Keuangan Bulanan</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card m-6">
      <CardHeader>
        <CardTitle>Laporan Keuangan Bulanan</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Ringkasan pemasukan, pengeluaran, dan saldo per bulan
          </span>
          <span className="@[540px]/card:hidden">Pemasukan, pengeluaran, dan saldo</span>
        </CardDescription>
        <CardAction className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder={year.toString()} />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 5}, (_, i) => year - 2 + i).map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="12m">12 bulan</ToggleGroupItem>
              <ToggleGroupItem value="6m">6 bulan</ToggleGroupItem>
              <ToggleGroupItem value="3m">3 bulan</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder={timeRange === "12m" ? "12 bulan" : timeRange === "6m" ? "6 bulan" : "3 bulan"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="12m" className="rounded-lg">12 bulan</SelectItem>
                <SelectItem value="6m" className="rounded-lg">6 bulan</SelectItem>
                <SelectItem value="3m" className="rounded-lg">3 bulan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Toggle untuk menampilkan/sembunyikan seri data */}
          <ToggleGroup
            type="multiple"
            value={Object.keys(visibleSeries).filter(key => visibleSeries[key])}
            onValueChange={(values) => {
              const newVisibleSeries = {
                pemasukan: values.includes("pemasukan"),
                pengeluaran: values.includes("pengeluaran"),
                saldo: values.includes("saldo")
              };
              setVisibleSeries(newVisibleSeries);
            }}
            variant="outline"
            className="w-full justify-start gap-1"
          >
            <ToggleGroupItem value="pemasukan" aria-label="Toggle pemasukan">
              <span className={`text-xs ${visibleSeries.pemasukan ? 'text-green-500' : 'text-muted-foreground'}`}>
                Pemasukan
              </span>
            </ToggleGroupItem>
            <ToggleGroupItem value="pengeluaran" aria-label="Toggle pengeluaran">
              <span className={`text-xs ${visibleSeries.pengeluaran ? 'text-red-500' : 'text-muted-foreground'}`}>
                Pengeluaran
              </span>
            </ToggleGroupItem>
            <ToggleGroupItem value="saldo" aria-label="Toggle saldo">
              <span className={`text-xs ${visibleSeries.saldo ? 'text-blue-500' : 'text-muted-foreground'}`}>
                Saldo
              </span>
            </ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPemasukan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={0}
              interval={0}
              tickFormatter={(value) => monthNames[value - 1]}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : filteredData.length - 1}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => monthNames[value - 1]}
                  indicator="dot"
                />
              }
            />
            
            {/* Hanya render Area yang visibleSeries-nya true */}
            {visibleSeries.pemasukan && (
              <Area
                dataKey="pemasukan"
                type="natural"
                fill="url(#fillPemasukan)"
                stroke="#22c55e"
                stackId="1"
              />
            )}
            {visibleSeries.pengeluaran && (
              <Area
                dataKey="pengeluaran"
                type="natural"
                fill="url(#fillPengeluaran)"
                stroke="#ef4444"
                stackId="1"
              />
            )}
            {visibleSeries.saldo && (
              <Area
                dataKey="saldo"
                type="natural"
                fill="url(#fillSaldo)"
                stroke="#3b82f6"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}