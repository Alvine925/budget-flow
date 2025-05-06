"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, TrendingUp, Filter, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, LineChart as RechartsLineChart } from 'recharts';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const salesData = [
  { month: "Jan", sales: 4000, leads: 20 },
  { month: "Feb", sales: 3000, leads: 15 },
  { month: "Mar", sales: 5000, leads: 25 },
  { month: "Apr", sales: 4500, leads: 22 },
  { month: "May", sales: 6000, leads: 30 },
  { month: "Jun", sales: 5500, leads: 28 },
];

const recentDeals = [
  { id: "deal_1", name: "Project Phoenix", client: "Acme Corp", stage: "Closed Won", value: 5000, closeDate: "2024-07-10" },
  { id: "deal_2", name: "Website Redesign", client: "Beta Solutions", stage: "Negotiation", value: 3500, closeDate: "2024-07-25" },
  { id: "deal_3", name: "Marketing Campaign", client: "Gamma Inc.", stage: "Proposal Sent", value: 8000, closeDate: "2024-08-05" },
  { id: "deal_4", name: "Software Dev", client: "Delta LLC", stage: "Qualification", value: 12000, closeDate: "2024-08-15" },
];

const salesActivities = [
  { id: "act_1", type: "Call", contact: "John Doe (Acme)", summary: "Follow-up call re: proposal", date: "2024-07-14" },
  { id: "act_2", type: "Email", contact: "Jane Smith (Beta)", summary: "Sent updated contract", date: "2024-07-13" },
  { id: "act_3", type: "Meeting", contact: "Robert Brown (Gamma)", summary: "Product Demo", date: "2024-07-12" },
];

export default function SalesPage() {
  const getStageBadgeVariant = (stage: string) => {
    if (stage.toLowerCase().includes("won")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (stage.toLowerCase().includes("lost")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    if (stage.toLowerCase().includes("negotiation") || stage.toLowerCase().includes("proposal")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Sales Management</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search deals or activities..." className="max-w-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Stage
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Closed Won</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Negotiation</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Proposal Sent</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Qualification</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Closed Lost</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button> {/* This would link to a "/sales/new-deal" or similar */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Deal 
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales (This Month)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,550.00</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">Total value: $87,300</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads (This Month)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Monthly sales and new leads generated.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
                sales: { label: "Sales", color: "hsl(var(--chart-1))" },
                leads: { label: "Leads", color: "hsl(var(--chart-2))" },
              }} className="h-[300px] w-full">
                <RechartsLineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <RechartsLegend content={<ChartLegendContent />} />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="leads" stroke="var(--color-leads)" strokeWidth={2} />
                </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Deals</CardTitle>
                    <CardDescription>Overview of your latest sales deals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Deal Name</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentDeals.slice(0,5).map((deal) => ( // Show top 5
                                <TableRow key={deal.id}>
                                    <TableCell className="font-medium">{deal.name}</TableCell>
                                    <TableCell>{deal.client}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStageBadgeVariant(deal.stage)}>{deal.stage}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${deal.value.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {recentDeals.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No recent deals.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Activities</CardTitle>
                    <CardDescription>Scheduled calls, emails, and meetings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {salesActivities.slice(0,5).map((activity) => ( // Show top 5
                            <li key={activity.id} className="flex items-start justify-between text-sm p-2 rounded-md hover:bg-muted/50">
                               <div>
                                    <span className="font-medium">{activity.type}: {activity.contact}</span>
                                    <p className="text-xs text-muted-foreground">{activity.summary}</p>
                               </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</span>
                            </li>
                        ))}
                    </ul>
                    {salesActivities.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No upcoming activities.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}