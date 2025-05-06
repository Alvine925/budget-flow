
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Filter, PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const revenueData = [
  { month: "Jan", productSales: 3500, serviceRevenue: 1500, otherIncome: 200 },
  { month: "Feb", productSales: 3200, serviceRevenue: 1800, otherIncome: 150 },
  { month: "Mar", productSales: 4800, serviceRevenue: 2200, otherIncome: 300 },
  { month: "Apr", productSales: 4200, serviceRevenue: 2000, otherIncome: 250 },
  { month: "May", productSales: 5500, serviceRevenue: 2500, otherIncome: 400 },
  { month: "Jun", productSales: 5000, serviceRevenue: 2300, otherIncome: 350 },
];

const recentRevenueEntries = [
  { id: "rev_1", date: "2024-07-15", source: "Product Sale - SKU #123", category: "Product Sales", amount: 500.00, invoice: "INV-005" },
  { id: "rev_2", date: "2024-07-14", source: "Consulting Services - Client X", category: "Service Revenue", amount: 1200.00, invoice: "INV-002" },
  { id: "rev_3", date: "2024-07-12", source: "Affiliate Commission", category: "Other Income", amount: 75.50, invoice: null },
  { id: "rev_4", date: "2024-07-10", source: "Product Sale - SKU #456", category: "Product Sales", amount: 89.99, invoice: "INV-001" },
];

export default function RevenuesPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Revenue Tracking</h1>
          <div className="flex items-center gap-2">
             <Input placeholder="Search revenues..." className="max-w-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Category
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Product Sales</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Service Revenue</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Other Income</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
             <Link href="/transactions/new?type=income">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Revenue Entry
                </Button>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (YTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,670.50</div>
              <p className="text-xs text-muted-foreground">+18.5% compared to last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,472.54</div>
              <p className="text-xs text-muted-foreground">Based on last 12 months</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Revenue Source</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Product Sales</div>
              <p className="text-xs text-muted-foreground">65% of total revenue</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Revenue Breakdown</CardTitle>
            <CardDescription>Revenue from different sources over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
                productSales: { label: "Product Sales", color: "hsl(var(--chart-1))" },
                serviceRevenue: { label: "Service Revenue", color: "hsl(var(--chart-2))" },
                otherIncome: { label: "Other Income", color: "hsl(var(--chart-3))" },
              }} className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <RechartsLegend content={<ChartLegendContent />} />
                  <Bar dataKey="productSales" stackId="a" fill="var(--color-productSales)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="serviceRevenue" stackId="a" fill="var(--color-serviceRevenue)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="otherIncome" stackId="a" fill="var(--color-otherIncome)" radius={[0, 0, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Revenue Entries</CardTitle>
                <CardDescription>Latest recorded revenue transactions.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Invoice</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentRevenueEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{entry.date}</TableCell>
                                <TableCell className="font-medium">{entry.source}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{entry.category}</Badge>
                                </TableCell>
                                <TableCell>
                                    {entry.invoice ? (
                                        <Link href={`/invoices/${entry.invoice}`} className="text-primary hover:underline">
                                            {entry.invoice}
                                        </Link>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right text-green-600 font-semibold">${entry.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="mr-2">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {recentRevenueEntries.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    No revenue entries recorded yet.
                  </div>
                )}
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
