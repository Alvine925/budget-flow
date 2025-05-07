
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Landmark, HandCoins, Users, ListChecks } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React, { useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BalanceSheetSection {
  title: string;
  isMainHeader?: boolean;
  items: { description: string; amount: number }[];
  total: number;
}

const balanceSheetData: BalanceSheetSection[] = [
  {
    title: "Assets",
    isMainHeader: true,
    items: [],
    total: 0, // This will be calculated by summing child sections
  },
  {
    title: "Current Assets",
    items: [
      { description: "Cash and Cash Equivalents", amount: 50000 },
      { description: "Accounts Receivable", amount: 30000 },
      { description: "Inventory", amount: 25000 },
      { description: "Prepaid Expenses", amount: 5000 },
    ],
    total: 110000,
  },
  {
    title: "Non-Current Assets",
    items: [
      { description: "Property, Plant, and Equipment (Net)", amount: 150000 },
      { description: "Intangible Assets (Net)", amount: 20000 },
      { description: "Long-term Investments", amount: 10000 },
    ],
    total: 180000,
  },
  {
    title: "Total Assets",
    items: [],
    total: 290000, // Sum of Current Assets and Non-Current Assets
  },
  {
    title: "Liabilities",
    isMainHeader: true,
    items: [],
    total: 0, // Calculated
  },
  {
    title: "Current Liabilities",
    items: [
      { description: "Accounts Payable", amount: 20000 },
      { description: "Accrued Expenses", amount: 8000 },
      { description: "Short-term Loans", amount: 12000 },
    ],
    total: 40000,
  },
  {
    title: "Non-Current Liabilities",
    items: [
      { description: "Long-term Debt", amount: 60000 },
      { description: "Deferred Tax Liabilities", amount: 5000 },
    ],
    total: 65000,
  },
  {
    title: "Total Liabilities",
    items: [],
    total: 105000, // Sum of Current and Non-Current Liabilities
  },
  {
    title: "Equity",
    isMainHeader: true,
    items: [],
    total: 0, // Calculated
  },
  {
    title: "Owner's Equity",
    items: [
      { description: "Common Stock", amount: 100000 },
      { description: "Retained Earnings", amount: 85000 },
    ],
    total: 185000,
  },
  {
    title: "Total Equity",
    items: [],
    total: 185000,
  },
  {
    title: "Total Liabilities and Equity",
    items: [],
    total: 290000, // Total Liabilities + Total Equity (should match Total Assets)
  },
];

const summaryMetrics = {
  totalAssets: balanceSheetData.find(s => s.title === "Total Assets")?.total || 0,
  totalLiabilities: balanceSheetData.find(s => s.title === "Total Liabilities")?.total || 0,
  totalEquity: balanceSheetData.find(s => s.title === "Total Equity")?.total || 0,
};

export default function BalanceSheetPage() {
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
        pdf.save('balance-sheet-report.pdf');
      });
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Balance Sheet</h1>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Button variant="outline" onClick={handleExportPdf}>
              <Download className="mr-2 h-4 w-4" /> Export (PDF)
            </Button>
          </div>
        </div>

        <div ref={reportContentRef}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalAssets.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">What the company owns</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                <HandCoins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalLiabilities.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">What the company owes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summaryMetrics.totalEquity.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Owners' stake</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Balance Sheet</CardTitle>
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
                  {balanceSheetData.map((section, sectionIndex) => (
                    <React.Fragment key={sectionIndex}>
                      {section.isMainHeader ? (
                        <TableRow className="bg-primary/10">
                          <TableCell colSpan={2} className="font-bold text-lg text-primary">{section.title}</TableCell>
                        </TableRow>
                      ) : section.items.length > 0 ? (
                        // Sub-category like "Current Assets" or "Owner's Equity"
                        <TableRow> 
                          <TableCell colSpan={2} className="font-semibold text-foreground pt-4">{section.title}</TableCell>
                        </TableRow>
                      ) : null}
                      
                      {section.items.map((item, itemIndex) => (
                        <TableRow key={`${sectionIndex}-${itemIndex}`}>
                          <TableCell className="pl-8">{item.description}</TableCell>
                          <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}

                      {/* Total for sub-categories (e.g., "Total Current Assets") or main totals (e.g., "Total Assets") */}
                      {(!section.isMainHeader || section.title.startsWith("Total")) && (
                         <TableRow className={section.title.startsWith("Total Liabilities and Equity") || section.title.startsWith("Total Assets") ? "font-bold border-t-2 border-b-2" : "font-semibold border-t"}>
                          <TableCell className={section.title.startsWith("Total ") ? "pl-4" : "pl-4"}>
                              {section.title}
                          </TableCell>
                          <TableCell className="text-right">${section.total.toLocaleString()}</TableCell>
                        </TableRow>
                      )}

                      {/* Add a blank row for spacing after major sections like Total Assets, Total Liabilities, Total Equity */}
                      {(section.title === "Total Assets" || section.title === "Total Liabilities" || section.title === "Total Equity") && sectionIndex < balanceSheetData.length - 1 && (
                          <TableRow><TableCell colSpan={2} className="py-3"></TableCell></TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              {balanceSheetData.find(s => s.title === "Total Assets")?.total !== balanceSheetData.find(s => s.title === "Total Liabilities and Equity")?.total && (
                  <p className="text-destructive text-center mt-4 font-semibold">Warning: Total Assets do not match Total Liabilities and Equity. Please review your entries.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
