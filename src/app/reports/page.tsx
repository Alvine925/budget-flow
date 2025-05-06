
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, FileSpreadsheet, TrendingUp, Banknote, Users, Download, CalendarDays } from "lucide-react";
import Link from "next/link";
import { DatePickerWithRange } from "@/components/date-range-picker"; // Assume this component exists

export default function ReportsPage() {
  const reports = [
    { title: "Profit & Loss Statement", description: "View your income, expenses, and net profit over a period.", icon: FileSpreadsheet, link: "/reports/profit-loss", available: true },
    { title: "Balance Sheet", description: "Snapshot of your company's assets, liabilities, and equity.", icon: Banknote, link: "/reports/balance-sheet", available: true },
    { title: "Sales Report", description: "Analyze sales performance by product, client, or period.", icon: TrendingUp, link: "/reports/sales", available: true },
    { title: "Expense Report", description: "Detailed breakdown of expenses by category or vendor.", icon: TrendingUp, props: {className:"rotate-180"}, link: "/reports/expenses", available: true },
    { title: "Cash Flow Statement", description: "Track the movement of cash in and out of your business.", icon: Banknote, link: "/reports/cash-flow", available: false },
    { title: "Client Report", description: "Insights into your client base, sales, and interactions.", icon: Users, link: "/reports/clients", available: false },
    { title: "Inventory Summary", description: "Overview of stock levels, values, and movement.", icon: BarChart3, link: "/reports/inventory", available: false },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Financial Reports</h1>
          <div className="flex items-center gap-2">
             <DatePickerWithRange />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export All (PDF)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.title} className={`flex flex-col ${!report.available ? 'opacity-60 pointer-events-none' : ''}`}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex-shrink-0">
                  <report.icon className="h-8 w-8 text-primary" {...report.props} />
                </div>
                <div className="flex-1">
                  <CardTitle>{report.title}</CardTitle>
                  <CardDescription className="mt-1">{report.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                {report.available ? (
                  <Link href={report.link} legacyBehavior>
                    <Button className="w-full" variant="outline">
                      View Report
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
