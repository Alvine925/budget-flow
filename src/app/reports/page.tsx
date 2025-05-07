
"use client";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, FileSpreadsheet, TrendingUp, Banknote, Users, Download, CalendarDays, ListChecks, PieChartIcon } from "lucide-react";
import Link from "next/link";
import { DatePickerWithRange } from "@/components/date-range-picker"; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React, { useRef } from "react";

export default function ReportsPage() {
  const reports = [
    { title: "Profit & Loss Statement", description: "View your income, expenses, and net profit over a period.", icon: FileSpreadsheet, link: "/reports/profit-loss", available: true, id: "profit-loss-report" },
    { title: "Balance Sheet", description: "Snapshot of your company's assets, liabilities, and equity.", icon: ListChecks, link: "/reports/balance-sheet", available: true, id: "balance-sheet-report" },
    { title: "Sales Summary Report", description: "Analyze sales performance by product, client, or period.", icon: TrendingUp, link: "/reports/sales-summary", available: true, id: "sales-summary-report" },
    { title: "Expense Summary Report", description: "Detailed breakdown of expenses by category or vendor.", icon: PieChartIcon, link: "/reports/expense-summary", available: true, id: "expense-summary-report" },
    { title: "Cash Flow Statement", description: "Track the movement of cash in and out of your business.", icon: Banknote, link: "/reports/cash-flow", available: true, id: "cash-flow-report" },
    { title: "Client Report", description: "Insights into your client base, sales, and interactions.", icon: Users, link: "/reports/clients", available: true, id: "client-report" },
    { title: "Inventory Summary", description: "Overview of stock levels, values, and movement.", icon: BarChart3, link: "/reports/inventory", available: true, id: "inventory-summary-report" },
  ];

  const reportContainerRef = useRef<HTMLDivElement>(null);

  const handleExportAllPdf = async () => {
    if (reportContainerRef.current) {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });
      const reportElements = reportContainerRef.current.querySelectorAll<HTMLDivElement>('[data-report-id]');
      
      for (let i = 0; i < reportElements.length; i++) {
        const element = reportElements[i];
        const reportTitle = element.querySelector<HTMLElement>('[data-report-title]')?.innerText || "Report";
        
        // Temporarily display the full report content for capturing
        const reportLink = reports.find(r => r.id === element.dataset.reportId)?.link;
        if (reportLink) {
            // In a real app, you would fetch the content of the report page.
            // For this example, we'll just capture the card.
            // This part needs a more sophisticated solution for actual multi-page report export.
            // The current implementation will just capture the card summaries.
        }

        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        let imgWidthOnPdf = pdfWidth - 20; // 10mm margin on each side
        let imgHeightOnPdf = imgWidthOnPdf / ratio;

        if (imgHeightOnPdf > pdfHeight - 20) { // 10mm margin top/bottom
          imgHeightOnPdf = pdfHeight - 20;
          imgWidthOnPdf = imgHeightOnPdf * ratio;
        }
        
        const xPosition = (pdfWidth - imgWidthOnPdf) / 2;
        const yPosition = 10;


        if (i > 0) {
          pdf.addPage();
        }
        pdf.text(reportTitle, xPosition, yPosition - 2); // Title above image
        pdf.addImage(imgData, 'PNG', xPosition, yPosition , imgWidthOnPdf, imgHeightOnPdf);
      }
      pdf.save('all-reports.pdf');
    }
  };


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Financial Reports</h1>
          <div className="flex items-center gap-2">
             <DatePickerWithRange />
            <Button variant="outline" onClick={handleExportAllPdf}>
              <Download className="mr-2 h-4 w-4" /> Export All (PDF)
            </Button>
          </div>
        </div>

        <div ref={reportContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card 
              key={report.title} 
              className={`flex flex-col ${!report.available ? 'opacity-60 pointer-events-none' : ''}`}
              data-report-id={report.id} // Used for PDF export targeting
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="flex-shrink-0">
                  <report.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle data-report-title>{report.title}</CardTitle>
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
