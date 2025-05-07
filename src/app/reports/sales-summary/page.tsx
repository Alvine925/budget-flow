
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, DollarSign, ShoppingCart, BarChart } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React, { useRef } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, LineChart as RechartsLineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const salesTrendData = [
  { month: "Jan", sales: 42000 },
  { month: "Feb", sales: 48000 },
  { month: "Mar", sales: 55000 },
  { month: "Apr", sales: 51000 },
  { month: "May", sales: 62000 },
  { month: "Jun", sales: 58000 },
];

const salesByProductData = [
  { name: "Web Design Package", sales: 25000, quantity: 10 },
  { name: "Premium Laptop Model X", sales: 18000, quantity: 15 },
  { name: "Consulting Hour", sales: 12000, quantity: 80 },
  { name: "Wireless Mouse Z", sales: 4500, quantity: 100 },
  { name: "Monthly Support Plan", sales: 9900, quantity: 100 },
];

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const totalSales = salesByProductData.reduce((sum, item) => sum + item.sales, 0);
const totalQuantity = salesByProductData.reduce((sum, item) => sum + item.quantity, 0);
const averageOrderValue = totalSales / (totalQuantity || 1); // Prevent division by zero if no orders
const topProduct = salesByProductData.sort((a,b) => b.sales - a.sales)[0];

const summaryMetrics = {
  totalSales: totalSales,
  numberOfOrders: totalQuantity, // Assuming one item per order for simplicity, or this needs different data
  averageOrderValue: averageOrderValue,
  topSellingProduct: topProduct ? topProduct.name : "N/A",
};

export default function SalesSummaryPage() {
  const reportContentRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = () => {
    if (reportContentRef.current) {
      html2canvas(reportContentRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'p',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        let imgWidthOnPdf = pdfWidth - 20;
        let imgHeightOnPdf = imgWidthOnPdf / ratio;

        if (imgHeightOnPdf > pdfHeight - 20) {
          imgHeightOnPdf = pdfHeight - 20;
          imgWidthOnPdf = imgHeightOnPdf * ratio;
        }
        
        const xPosition = (pdfWidth - imgWidthOnPdf) / 2;
        const yPosition = 10;

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidthOnPdf, imgHeightOnPdf);
        pdf.save('sales-summary-report.pdf');
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Sales Summary Report</h1>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Button variant="outline" onClick={handleExportPdf}>
              <Download className="mr-2 h-4 w-4" /> Export (PDF)
            </Button>
          </div>
        </div>
        <div ref={reportContentRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">For the selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Number of Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryMetrics.numberOfOrders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total items sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Sale Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Average revenue per item sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Selling Item</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate" title={summaryMetrics.topSellingProduct}>{summaryMetrics.topSellingProduct}</div>
                <p className="text-xs text-muted-foreground">By revenue</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                  <CardHeader>
                      <CardTitle>Sales Trend</CardTitle>
                      <CardDescription>Monthly sales revenue over the period.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={{ sales: { label: "Sales", color: "hsl(var(--chart-1))" } }} className="h-[300px] w-full">
                      <RechartsLineChart data={salesTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                          <RechartsTooltip content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />} />
                          <RechartsLegend content={<ChartLegendContent />} />
                          <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
                      </RechartsLineChart>
                      </ChartContainer>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>Sales by Product/Service</CardTitle>
                      <CardDescription>Revenue distribution among products/services.</CardDescription>
                  </CardHeader>
                  <CardContent>
                       <ChartContainer config={salesByProductData.reduce((acc, item, index) => ({...acc, [item.name]: {label:item.name, color: PIE_COLORS[index % PIE_COLORS.length]}}), {})} className="h-[300px] w-full">
                          <RechartsPieChart>
                          <RechartsTooltip content={<ChartTooltipContent hideLabel formatter={(value, name) => `${name}: $${Number(value).toLocaleString()}`}/>} />
                          <Pie data={salesByProductData} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({name, percent}) => `${name.substring(0,15)+(name.length > 15 ? "..." : "")}: ${(percent * 100).toFixed(0)}%`}>
                              {salesByProductData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                          </Pie>
                          <RechartsLegend content={<ChartLegendContent nameKey="name" />} />
                          </RechartsPieChart>
                      </ChartContainer>
                  </CardContent>
              </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Sales Breakdown</CardTitle>
              <CardDescription>Sales figures per product/service for the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product/Service</TableHead>
                    <TableHead className="text-right">Quantity Sold</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                    <TableHead className="text-right">Percentage of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesByProductData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.sales.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{((item.sales / summaryMetrics.totalSales) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                  {salesByProductData.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No sales data available for the selected period.
                          </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
