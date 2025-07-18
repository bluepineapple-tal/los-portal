import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { LoanApplicationList } from "@/components/loan-applications/loan-application-list";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <StatsGrid />

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <div className="px-4 lg:px-6">
            <div className="text-2xl scroll-m-20 pb-2 font-semibold tracking-tight first:mt-0">
              Recent Loan Applications
            </div>
            <LoanApplicationList />
          </div>

          {/* <DataTable data={data} /> */}
        </div>
      </div>
    </div>
  );
}
