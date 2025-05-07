
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign, Minus, FileSpreadsheet } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React, { useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportRow {
  category: string;
  items: { description: string; amount: number }[];
  total: number;
  isSubHeader?: boolean;
  isBold?: boolean;
}

const profitLossData: ReportRow[] = [
  {
    category: "Revenue",
    isSubHeader: true,
    isBold: true,
    items: [
      { description: "Product Sales", amount: 75000 },
      { description: "Service Income", amount: 25000 },
    ],
    total: 100000,
  },
  {
    category: "Cost of Goods Sold",
    isSubHeader: true,
    isBold: true,
    items: [
      { description: "Material Costs", amount: 20000 },
      { description: "Direct Labor", amount: 15000 },
    ],
    total: 35000,
  },
  {
    category: "Gross Profit",
    isSubHeader: false,
    isBold: true,
    items: [],
    total: 65000, // Revenue - COGS
  },
  {
    category: "Operating Expenses",
    isSubHeader: true,
    isBold: true,
    items: [
      { description: "Salaries and Wages", amount: 18000 },
      { description: "Rent and Utilities", amount: 5000 },
      { description: "Marketing and Advertising", amount: 7000 },
      { description: "Software Subscriptions", amount: 1000 },
      { description: "Other Operating Expenses", amount: 2000 },
    ],
    total: 33000,
  },
  {
    category: "Operating Income (EBIT)",
    isSubHeader: false,
    isBold: true,
    items: [],
    total: 32000, // Gross Profit - Operating Expenses
  },
  {
    category: "Other Income & Expenses",
    isSubHeader: true,
    isBold: false,
    items: [
        { description: "Interest Income", amount: 500 },
        { description: "Interest Expense", amount: -200 },
    ],
    total: 300,
  },
  {
    category: "Income Before Tax",
    isSubHeader: false,
    isBold: true,
    items: [],
    total: 32300, // Operating Income + Other Income & Expenses
  },
  {
    category: "Income Tax Expense",
    isSubHeader: false,
    isBold: false,
    items: [],
    total: 6460, // Assuming 20% tax rate
  },
  {
    category: "Net Profit",
    isSubHeader: false,
    isBold: true,
    items: [],
    total: 25840, // Income Before Tax - Income Tax Expense
  },
];

const summaryMetrics = {
  totalRevenue: profitLossData.find(r => r.category === "Revenue")?.total || 0,
  grossProfit: profitLossData.find(r => r.category === "Gross Profit")?.total || 0,
  totalExpenses: (profitLossData.find(r => r.category === "Cost of Goods Sold")?.total || 0) + (profitLossData.find(r => r.category === "Operating Expenses")?.total || 0),
  netProfit: profitLossData.find(r => r.category === "Net Profit")?.total || 0,
};

export default function ProfitLossPage() {
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
        pdf.save('profit-loss-report.pdf');
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Profit & Loss Statement</h1>
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
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">For the selected period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.grossProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Revenue minus COGS</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalExpenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">COGS + Operating Expenses</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.netProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">After all expenses and taxes</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Profit & Loss</CardTitle>
              <CardDescription>Breakdown of revenues, costs, and expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitLossData.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {row.isSubHeader && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={2} className={`font-semibold ${row.isBold ? 'text-foreground' : 'text-muted-foreground'}`}>{row.category}</TableCell>
                        </TableRow>
                      )}
                      {row.items.map((item, itemIndex) => (
                        <TableRow key={`${rowIndex}-${itemIndex}`}>
                          <TableCell className="pl-8">{item.description}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {!row.isSubHeader && (
                        <TableRow className={row.isBold ? "font-bold border-t-2 border-b-2" : "border-t"}>
                          <TableCell>{row.category}</TableCell>
                          <TableCell className="text-right">${row.total.toLocaleString()}</TableCell>
                        </TableRow>
                      )}
                      {/* Total for subheader sections */}
                      {row.isSubHeader && (
                          <TableRow className="font-semibold border-t">
                              <TableCell className="pl-4">Total {row.category}</TableCell>
                              <TableCell className="text-right">${row.total.toLocaleString()}</TableCell>
                          </TableRow>
                      )}
                      {/* Add a blank row for spacing after major sections, except for the last one */}
                      {(row.category === "Gross Profit" || row.category === "Operating Income (EBIT)" || row.category === "Income Before Tax") && rowIndex < profitLossData.length - 1 && (
                          <TableRow><TableCell colSpan={2} className="py-2"></TableCell></TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
