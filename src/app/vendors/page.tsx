
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Edit, Trash2, Filter, Truck, MoreHorizontal, Mail, Phone } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Mock data for vendors
const vendors = [
  { id: "ven_1", name: "Supplier Alpha", contactPerson: "John Smith", email: "john.s@supplieralpha.com", phone: "555-1234", category: "Inventory Supplier", totalSpent: 12500.00 },
  { id: "ven_2", name: "Utility Co.", contactPerson: "Sarah Miller", email: "billing@utilityco.com", phone: "555-5678", category: "Utilities", totalSpent: 2300.50 },
  { id: "ven_3", name: "Software Inc.", contactPerson: "David Lee", email: "sales@softwareinc.com", phone: "555-8765", category: "Software Provider", totalSpent: 1500.00 },
  { id: "ven_4", name: "Marketing Agency Beta", contactPerson: "Emily White", email: "emily@marketingbeta.com", phone: "555-4321", category: "Marketing Services", totalSpent: 8500.00 },
  { id: "ven_5", name: "Landlord Properties", contactPerson: "Property Manager", email: "rentals@landlordprop.com", phone: "555-1122", category: "Real Estate", totalSpent: 24000.00 },
];

export default function VendorsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Vendor Management</h1>
          <div className="flex items-center gap-2">
             <Input placeholder="Search vendors..." className="max-w-sm" />
            {/* Potential Filter for Category could be added here */}
            <Button> {/* Link to /vendors/new */}
              <PlusCircle className="mr-2 h-4 w-4" /> Add Vendor
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Vendors</CardTitle>
            <CardDescription>Manage your vendor information and track purchases.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={`https://picsum.photos/seed/${vendor.id}/40/40`} alt="Vendor Avatar" data-ai-hint="company logo" />
                                <AvatarFallback>{vendor.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {vendor.name}
                        </div>
                    </TableCell>
                    <TableCell>{vendor.contactPerson}</TableCell>
                    <TableCell>
                        <a href={`mailto:${vendor.email}`} className="text-primary hover:underline flex items-center gap-1">
                           <Mail className="h-3.5 w-3.5" /> {vendor.email}
                        </a>
                    </TableCell>
                    <TableCell>
                        <a href={`tel:${vendor.phone}`} className="text-primary hover:underline flex items-center gap-1">
                           <Phone className="h-3.5 w-3.5" /> {vendor.phone}
                        </a>
                    </TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell className="text-right">${vendor.totalSpent.toFixed(2)}</TableCell>
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
                            <Truck className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Vendor
                          </DropdownMenuItem>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Vendor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {vendors.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No vendors found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
