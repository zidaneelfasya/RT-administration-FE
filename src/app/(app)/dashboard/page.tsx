import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";
import { ChartMonthlyReport } from "@/components/chart-monthly-report";

export default function Page() {
  return (
    <div>
      <SectionCards />
      <ChartMonthlyReport />
    </div>
  );
}
