
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, DollarSign, ArrowDownToLine, ArrowUpFromLine, Banknote } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React, { useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CashFlowSection {
  title: string;
  isMainHeader?: boolean;
  items: { description: string; amount: number }[];
  total: number;
}

// Simplified mock data for Cash Flow Statement
const cashFlowData: CashFlowSection[] = [
  {
    title: "Cash Flows from Operating Activities",
    isMainHeader: true,
    items: [
      { description: "Net Income", amount: 25840 },
      { description: "Depreciation", amount: 5000 },
      { description: "Changes in Accounts Receivable", amount: -2000 },
      { description: "Changes in Inventory", amount: 1000 },
      { description: "Changes in Accounts Payable", amount: 3000 },
    ],
    total: 32840,
  },
  {
    title: "Net Cash from Operating Activities",
    items: [],
    total: 32840,
  },
  {
    title: "Cash Flows from Investing Activities",
    isMainHeader: true,
    items: [
      { description: "Purchase of Property, Plant, and Equipment", amount: -15000 },
      { description: "Proceeds from Sale of Assets", amount: 2000 },
    ],
    total: -13000,
  },
  {
    title: "Net Cash from Investing Activities",
    items: [],
    total: -13000,
  },
  {
    title: "Cash Flows from Financing Activities",
    isMainHeader: true,
    items: [
      { description: "Proceeds from Long-Term Debt", amount: 10000 },
      { description: "Payment of Dividends", amount: -5000 },
    ],
    total: 5000,
  },
  {
    title: "Net Cash from Financing Activities",
    items: [],
    total: 5000,
  },
  {
    title: "Net Increase (Decrease) in Cash",
    isMainHeader: true,
    items: [],
    total: 24840, // 32840 - 13000 + 5000
  },
  {
    title: "Cash at Beginning of Period",
    items: [],
    total: 10000,
  },
  {
    title: "Cash at End of Period",
    items: [],
    total: 34840, // 24840 + 10000
  },
];

const summaryMetrics = {
  netCashFromOperating: cashFlowData.find(s => s.title === "Net Cash from Operating Activities")?.total || 0,
  netCashFromInvesting: cashFlowData.find(s => s.title === "Net Cash from Investing Activities")?.total || 0,
  netCashFromFinancing: cashFlowData.find(s => s.title === "Net Cash from Financing Activities")?.total || 0,
  netChangeInCash: cashFlowData.find(s => s.title === "Net Increase (Decrease) in Cash")?.total || 0,
};

export default function CashFlowPage() {
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
        pdf.save('cash-flow-report.pdf');
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Cash Flow Statement</h1>
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
                <CardTitle className="text-sm font-medium">Operating Cash Flow</CardTitle>
                <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.netCashFromOperating.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Cash from core operations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investing Cash Flow</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.netCashFromInvesting.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Cash for investments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financing Cash Flow</CardTitle>
                <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.netCashFromFinancing.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Cash from financing</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Change in Cash</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${summaryMetrics.netChangeInCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${summaryMetrics.netChangeInCash.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Overall cash movement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Cash Flow Statement</CardTitle>
              <CardDescription>As of [Selected Date Range End]</CardDescription>
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
                  {cashFlowData.map((section, sectionIndex) => (
                    <React.Fragment key={sectionIndex}>
                      {section.isMainHeader ? (
                        <TableRow className="bg-primary/10">
                          <TableCell colSpan={2} className="font-bold text-lg text-primary pt-4 pb-2">{section.title}</TableCell>
                        </TableRow>
                      ) : (
                        <TableRow className="font-semibold border-t">
                          <TableCell>{section.title}</TableCell>
                          <TableCell className="text-right">${section.total.toLocaleString()}</TableCell>
                        </TableRow>
                      )}
                      
                      {section.items.map((item, itemIndex) => (
                        <TableRow key={`${sectionIndex}-${itemIndex}`}>
                          <TableCell className="pl-8">{item.description}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Spacing after main totals */}
                       {(section.title.startsWith("Net Cash") || section.title === "Cash at End of Period" || section.title === "Cash at Beginning of Period") && sectionIndex < cashFlowData.length -1 && !cashFlowData[sectionIndex+1].isMainHeader && (
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
