
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const clientRevenueData = [
  { name: "Acme Corp", revenue: 25000, projects: 3 },
  { name: "Beta Solutions", revenue: 18000, projects: 5 },
  { name: "Gamma Inc.", revenue: 32000, projects: 2 },
  { name: "Delta LLC", revenue: 15000, projects: 4 },
  { name: "Epsilon Ltd.", revenue: 22000, projects: 6 },
];

const newVsReturningClientsData = [
  { month: "Jan", new: 5, returning: 15 },
  { month: "Feb", new: 7, returning: 18 },
  { month: "Mar", new: 6, returning: 20 },
  { month: "Apr", new: 8, returning: 17 },
  { month: "May", new: 10, returning: 22 },
  { month: "Jun", new: 9, returning: 25 },
];

const totalClients = clientRevenueData.length;
const totalRevenueFromClients = clientRevenueData.reduce((sum, client) => sum + client.revenue, 0);
const averageRevenuePerClient = totalClients > 0 ? totalRevenueFromClients / totalClients : 0;
const topClientByRevenue = clientRevenueData.sort((a, b) => b.revenue - a.revenue)[0];

const summaryMetrics = {
  totalClients: totalClients,
  totalRevenue: totalRevenueFromClients,
  averageRevenuePerClient: averageRevenuePerClient,
  topClient: topClientByRevenue ? topClientByRevenue.name : "N/A",
};


export default function ClientReportPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Client Report</h1>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export (PDF)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.totalClients}</div>
              <p className="text-xs text-muted-foreground">Clients with activity this period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Client Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summaryMetrics.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Generated this period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Revenue/Client</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summaryMetrics.averageRevenuePerClient.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Average for active clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Client</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate" title={summaryMetrics.topClient}>{summaryMetrics.topClient}</div>
              <p className="text-xs text-muted-foreground">By revenue generated</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Top Clients by Revenue</CardTitle>
              <CardDescription>Revenue generated by top performing clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-1))" } }} className="h-[300px] w-full">
                <RechartsBarChart data={clientRevenueData.slice(0, 5)} layout="vertical" margin={{ right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value/1000}k`} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New vs. Returning Clients</CardTitle>
              <CardDescription>Monthly trend of new and returning client engagements.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ new: { label: "New Clients", color: "hsl(var(--chart-2))" }, returning: { label: "Returning Clients", color: "hsl(var(--chart-3))" } }} className="h-[300px] w-full">
                <RechartsBarChart data={newVsReturningClientsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="new" stackId="a" fill="var(--color-new)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" stackId="a" fill="var(--color-returning)" radius={[0, 0, 0, 0]}/>
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client List & Key Metrics</CardTitle>
            <CardDescription>Detailed list of clients and their performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Number of Projects/Sales</TableHead>
                  {/* Add more relevant metrics like Last Activity Date */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientRevenueData.map((client) => (
                  <TableRow key={client.name}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-right">${client.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{client.projects}</TableCell>
                  </TableRow>
                ))}
                 {clientRevenueData.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                        No client data available for the selected period.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
