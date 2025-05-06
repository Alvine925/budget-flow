
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, Send, FileText, CheckSquare, MoreHorizontal } from "lucide-react";
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

// Mock data for quotations
const quotations = [
  { id: "qt_1", quotationNumber: "QT-001", clientName: "Prospective Client A", issueDate: "2024-07-10", expiryDate: "2024-08-09", amount: 2500.00, status: "Sent" },
  { id: "qt_2", quotationNumber: "QT-002", clientName: "Lead B Corp", issueDate: "2024-07-05", expiryDate: "2024-08-04", amount: 1200.50, status: "Accepted" },
  { id: "qt_3", quotationNumber: "QT-003", clientName: "Possible Partner C", issueDate: "2024-06-28", expiryDate: "2024-07-28", amount: 5000.00, status: "Declined" },
  { id: "qt_4", quotationNumber: "QT-004", clientName: "New Contact D", issueDate: "2024-07-15", expiryDate: "2024-08-14", amount: 800.75, status: "Draft" },
  { id: "qt_5", quotationNumber: "QT-005", clientName: "Referral E Ltd.", issueDate: "2024-07-01", expiryDate: "2024-07-31", amount: 3200.00, status: "Expired" },
];

export default function QuotationsPage() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "declined":
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Quotations</h1>
           <div className="flex items-center gap-2">
            <Input placeholder="Search quotations..." className="max-w-sm" />
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
                <DropdownMenuCheckboxItem>Accepted</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Sent</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Expired</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/quotations/new"> {/* Link to /quotations/new */}
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Quotation
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
            <CardDescription>Manage your client quotations and track their status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quotation #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.map((quotation) => (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                    <TableCell>{quotation.clientName}</TableCell>
                    <TableCell>{quotation.issueDate}</TableCell>
                    <TableCell>{quotation.expiryDate}</TableCell>
                    <TableCell className="text-right">${quotation.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(quotation.status)}>
                        {quotation.status}
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
                           <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View Quotation
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                           {quotation.status === "Draft" && (
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" /> Send to Client
                            </DropdownMenuItem>
                          )}
                          {quotation.status === "Sent" && (
                             <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" /> Resend Quotation
                            </DropdownMenuItem>
                          )}
                          {quotation.status === "Accepted" && (
                            <DropdownMenuItem>
                              <CheckSquare className="mr-2 h-4 w-4" /> Convert to Invoice
                            </DropdownMenuItem>
                          )}
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {quotations.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No quotations found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
