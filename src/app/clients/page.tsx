
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, Users, MoreHorizontal, Mail, Phone, DollarSign } from "lucide-react";
import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const clientFormSchema = z.object({
  name: z.string().min(1, "Client name is required."),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address.").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(), // e.g., "Key Account", "New Lead", "Past Client"
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

interface Client extends ClientFormValues {
  id: string;
  totalRevenue: number;
  status: "Active" | "Inactive" | "Lead";
  avatarUrl?: string;
}

const initialClients: Client[] = [
  { id: "client_1", name: "Acme Corp", contactPerson: "John Doe", email: "john.doe@acme.com", phone: "555-0101", address: "123 Main St, Anytown USA", category: "Key Account", totalRevenue: 25000, status: "Active", avatarUrl: "https://picsum.photos/seed/acme/40/40" },
  { id: "client_2", name: "Beta Solutions", contactPerson: "Jane Smith", email: "jane.smith@beta.io", phone: "555-0102", address: "456 Oak Ave, Anytown USA", category: "New Lead", totalRevenue: 0, status: "Lead", avatarUrl: "https://picsum.photos/seed/beta/40/40" },
  { id: "client_3", name: "Gamma Inc.", contactPerson: "Robert Brown", email: "robert.b@gamma.co", phone: "555-0103", category: "Past Client", totalRevenue: 5000, status: "Inactive" },
  { id: "client_4", name: "Delta LLC", contactPerson: "Alice Green", email: "alice.g@delta.org", phone: "555-0104", category: "Active Client", totalRevenue: 12000, status: "Active", avatarUrl: "https://picsum.photos/seed/delta/40/40" },
];

const clientCategories = ["Key Account", "Active Client", "New Lead", "Past Client", "Prospect"];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
  });

  React.useEffect(() => {
    if (editingClient) {
      form.reset(editingClient);
    } else {
      form.reset({ name: "", contactPerson: "", email: "", phone: "", address: "", category: "" });
    }
  }, [editingClient, form, isDialogOpen]);

  function onSubmit(data: ClientFormValues) {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...editingClient, ...data } : c));
      toast({ title: "Client Updated", description: `Client "${data.name}" updated successfully.` });
    } else {
      const newClient: Client = { 
        id: `client_${Date.now()}`, 
        ...data, 
        totalRevenue: 0, 
        status: data.category === "New Lead" ? "Lead" : "Active" // Basic status logic
      };
      setClients([...clients, newClient]);
      toast({ title: "Client Added", description: `Client "${data.name}" added successfully.` });
    }
    setIsDialogOpen(false);
    setEditingClient(null);
  }

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast({ title: "Client Deleted", description: "Client has been deleted.", variant: "destructive" });
  };
  
  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "lead":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Clients</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search clients..." className="max-w-sm" />
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
                <DropdownMenuCheckboxItem>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Lead</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Inactive</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{clients.length}</div>
                    <p className="text-xs text-muted-foreground">{clients.filter(c => c.status === 'Active').length} active</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Client Revenue (YTD)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${clients.reduce((sum, c) => sum + c.totalRevenue, 0).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Across all clients</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Leads (This Month)</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{clients.filter(c => c.status === 'Lead').length}</div>
                     <p className="text-xs text-muted-foreground">Potential new business</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>Manage your client relationships and information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                           <AvatarImage src={client.avatarUrl} alt={client.name} data-ai-hint="company logo person" />
                           <AvatarFallback>{client.name.split(' ').map(n=>n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {client.name}
                      </div>
                    </TableCell>
                    <TableCell><a href={`mailto:${client.email}`} className="text-primary hover:underline flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {client.email || 'N/A'}</a></TableCell>
                    <TableCell><a href={`tel:${client.phone}`} className="text-primary hover:underline flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {client.phone || 'N/A'}</a></TableCell>
                    <TableCell><Badge variant="outline">{client.category || 'N/A'}</Badge></TableCell>
                    <TableCell className="text-right">${client.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell><Badge className={getStatusBadgeVariant(client.status)}>{client.status}</Badge></TableCell>
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
                           <DropdownMenuItem onClick={() => openEditDialog(client)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Client
                          </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                              <Link href={`/invoices/new?client=${client.id}`}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                              <Link href={`/quotations/new?client=${client.id}`}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Create Quotation
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => handleDeleteClient(client.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {clients.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No clients found.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
              <DialogDescription>
                {editingClient ? "Update the client's details." : "Enter the new client's information."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                 <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Client Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="contactPerson" render={({ field }) => (
                    <FormItem><FormLabel>Contact Person (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                 </div>
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address (Optional)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {clientCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select><FormMessage /></FormItem>
                )}/>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingClient ? "Save Changes" : "Add Client"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
}
