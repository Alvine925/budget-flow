
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, CreditCard, MoreHorizontal, CheckCircle2 } from "lucide-react";
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

// Mock data for bills
const bills = [
  { id: "bill_1", vendorName: "Supplier Alpha", billDate: "2024-07-10", dueDate: "2024-08-09", amount: 350.00, status: "Unpaid", category: "Inventory" },
  { id: "bill_2", vendorName: "Utility Co.", billDate: "2024-07-01", dueDate: "2024-07-15", amount: 120.75, status: "Paid", category: "Utilities" },
  { id: "bill_3", vendorName: "Software Inc.", billDate: "2024-06-25", dueDate: "2024-07-25", amount: 99.00, status: "Overdue", category: "Software" },
  { id: "bill_4", vendorName: "Landlord Properties", billDate: "2024-07-01", dueDate: "2024-07-05", amount: 1200.00, status: "Paid", category: "Rent" },
  { id: "bill_5", vendorName: "Marketing Agency Beta", billDate: "2024-07-15", dueDate: "2024-08-14", amount: 750.00, status: "Scheduled", category: "Marketing" },
];

export default function BillsPage() {
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Bill Management</h1>
           <div className="flex items-center gap-2">
            <Input placeholder="Search bills..." className="max-w-sm" />
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
                <DropdownMenuCheckboxItem>Unpaid</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Overdue</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Scheduled</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button> {/* Link to /bills/new */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bill
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
            <CardDescription>Manage vendor bills and track payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Bill Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.vendorName}</TableCell>
                    <TableCell>{bill.category}</TableCell>
                    <TableCell>{bill.billDate}</TableCell>
                    <TableCell>{bill.dueDate}</TableCell>
                    <TableCell className="text-right">${bill.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(bill.status)}>
                        {bill.status}
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
                            <CreditCard className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Bill
                          </DropdownMenuItem>
                          {(bill.status === "Unpaid" || bill.status === "Overdue") && (
                            <DropdownMenuItem>
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {bill.status === "Unpaid" && (
                            <DropdownMenuItem>
                               <CreditCard className="mr-2 h-4 w-4" /> Schedule Payment
                            </DropdownMenuItem>
                          )}
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Bill
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {bills.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No bills found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
