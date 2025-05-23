
"use client"; // Added "use client" directive

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, Send, FileText, MoreHorizontal, Settings } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";


// Mock data for invoices
const invoices = [
  { id: "inv_1", invoiceNumber: "INV-001", clientName: "Acme Corp", issueDate: "2024-07-01", dueDate: "2024-07-31", amount: 1500.00, status: "Paid" },
  { id: "inv_2", invoiceNumber: "INV-002", clientName: "Beta Solutions", issueDate: "2024-07-05", dueDate: "2024-08-04", amount: 850.50, status: "Sent" },
  { id: "inv_3", invoiceNumber: "INV-003", clientName: "Gamma Inc.", issueDate: "2024-06-20", dueDate: "2024-07-20", amount: 2200.00, status: "Overdue" },
  { id: "inv_4", invoiceNumber: "INV-004", clientName: "Delta LLC", issueDate: "2024-07-10", dueDate: "2024-08-09", amount: 500.75, status: "Draft" },
  { id: "inv_5", invoiceNumber: "INV-005", clientName: "Epsilon Ltd.", issueDate: "2024-07-15", dueDate: "2024-08-14", amount: 3000.00, status: "Sent" },
];

export default function InvoicesPage() {
  const { toast } = useToast();

  const handleViewInvoice = (invoiceId: string) => {
    // Mock action: In a real app, this would navigate to an invoice detail page or open a preview modal.
    console.log(`Viewing invoice: ${invoiceId}`);
    toast({ title: "View Invoice (Mock)", description: `Displaying details for invoice ${invoiceId}.` });
  };

  const handleSendReminder = (invoiceId: string) => {
     // Mock action
    console.log(`Sending reminder for invoice: ${invoiceId}`);
    toast({ title: "Reminder Sent (Mock)", description: `Payment reminder sent for invoice ${invoiceId}.` });
  };

   const handleDeleteInvoice = (invoiceId: string) => {
    // Mock action
    console.log(`Deleting invoice: ${invoiceId}`);
    toast({ title: "Invoice Deleted (Mock)", description: `Invoice ${invoiceId} has been deleted.`, variant: "destructive" });
    // Here you would filter out the invoice from your state
  };


  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"; // For pending or other statuses
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Invoices</h1>
          <div className="flex items-center gap-2">
             <Input placeholder="Search invoices..." className="max-w-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Status
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Paid</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Sent</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Overdue</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/settings/templates" passHref>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Settings className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Template Settings
                </span>
              </Button>
            </Link>
            <Link href="/invoices/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Manage your client invoices and track payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.issueDate}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewInvoice(invoice.id)}>
                            <FileText className="mr-2 h-4 w-4" /> View Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/new?edit=${invoice.id}`}> {/* Assuming edit uses same form with ID */}
                               <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          {invoice.status !== "Paid" && (
                            <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}>
                              <Send className="mr-2 h-4 w-4" /> Send Reminder
                            </DropdownMenuItem>
                          )}
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => handleDeleteInvoice(invoice.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {invoices.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No invoices found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

    