import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


import { ChartMonthlyReport } from "@/components/chart-monthly-report";
import { PenghuniDataTable } from "@/components/data-table-penghuni";


export default function Page() {
  return (
    <div>
      <PenghuniDataTable />
    </div>
  );
}
