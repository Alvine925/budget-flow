
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingDown, DollarSign, ListFilter, PieChartIcon } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React, { useRef } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const expenseTrendData = [
  { month: "Jan", expenses: 22000 },
  { month: "Feb", expenses: 25000 },
  { month: "Mar", expenses: 23000 },
  { month: "Apr", expenses: 28000 },
  { month: "May", expenses: 26000 },
  { month: "Jun", expenses: 30000 },
];

const expensesByCategoryData = [
  { name: "Salaries & Wages", value: 18000, count: 5 },
  { name: "Marketing", value: 7000, count: 12 },
  { name: "Rent & Utilities", value: 5000, count: 3 },
  { name: "Software Subscriptions", value: 1000, count: 10 },
  { name: "Office Supplies", value: 1500, count: 20 },
  { name: "Travel", value: 2500, count: 8 },
  { name: "Other Operating Expenses", value: 2000, count: 15 },
];

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-1)/0.7)", "hsl(var(--chart-2)/0.7)"];


const totalExpenses = expensesByCategoryData.reduce((sum, item) => sum + item.value, 0);
const totalTransactions = expensesByCategoryData.reduce((sum, item) => sum + item.count, 0);
const averageExpenseValue = totalExpenses / (totalTransactions || 1);
const topExpenseCategory = expensesByCategoryData.sort((a, b) => b.value - a.value)[0];


const summaryMetrics = {
  totalExpenses: totalExpenses,
  numberOfTransactions: totalTransactions,
  averageExpenseValue: averageExpenseValue,
  topExpenseCategory: topExpenseCategory ? topExpenseCategory.name : "N/A",
};

export default function ExpenseSummaryPage() {
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
        pdf.save('expense-summary-report.pdf');
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Expense Summary Report</h1>
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
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">For the selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expense Transactions</CardTitle>
                <ListFilter className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryMetrics.numberOfTransactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total count of expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Expense Value</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.averageExpenseValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Average amount per transaction</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Expense Category</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate" title={summaryMetrics.topExpenseCategory}>{summaryMetrics.topExpenseCategory}</div>
                <p className="text-xs text-muted-foreground">By total amount spent</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                  <CardHeader>
                      <CardTitle>Expense Trend</CardTitle>
                      <CardDescription>Monthly total expenses over the period.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={{ expenses: { label: "Expenses", color: "hsl(var(--chart-2))" } }} className="h-[300px] w-full">
                      <RechartsBarChart data={expenseTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                          <RechartsTooltip content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />} />
                          <RechartsLegend content={<ChartLegendContent />} />
                          <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                      </ChartContainer>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                      <CardTitle>Expense Distribution by Category</CardTitle>
                      <CardDescription>How expenses are allocated across categories.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={expensesByCategoryData.reduce((acc, item, index) => ({...acc, [item.name]: {label:item.name, color: PIE_COLORS[index % PIE_COLORS.length]}}), {})} className="h-[300px] w-full">
                          <RechartsPieChart>
                          <RechartsTooltip content={<ChartTooltipContent hideLabel formatter={(value, name) => `${name}: $${Number(value).toLocaleString()}`}/>} />
                          <Pie data={expensesByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({name, percent}) => `${name.substring(0,15)+(name.length > 15 ? "..." : "")}: ${(percent * 100).toFixed(0)}%`}>
                              {expensesByCategoryData.map((entry, index) => (
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
              <CardTitle>Detailed Expense Breakdown</CardTitle>
              <CardDescription>Expenses per category for the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense Category</TableHead>
                    <TableHead className="text-right">Number of Transactions</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Percentage of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesByCategoryData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.value.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{((item.value / summaryMetrics.totalExpenses) * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                   {expensesByCategoryData.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No expense data available for the selected period.
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
