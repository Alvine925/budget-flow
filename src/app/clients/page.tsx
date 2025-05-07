
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, Users, MoreHorizontal, Mail, Phone, DollarSign, Save } from "lucide-react";
import React, { useState, useEffect } from "react"; // Import useEffect
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
// Import mock data
import { initialClients as mockClientsData, clientCategories, type Client } from "@/data/mockData";


const clientFormSchema = z.object({
  label: z.string().min(1, "Client name is required."), // Use 'label' for name consistency
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(), // e.g., "Key Account", "New Lead", "Past Client"
});

// Adjust type to match Zod schema if needed, or keep Client interface separate
type ClientFormValues = z.infer<typeof clientFormSchema>;

// localStorage key
const LOCAL_STORAGE_KEY_CLIENTS = 'budgetflow-clients';

export default function ClientsPage() {
  // Initialize with mock data, will be updated by useEffect from localStorage
  const [clients, setClients] = useState<Client[]>(mockClientsData); 
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("all-clients");
  const { toast } = useToast();

  // Load clients from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
      if (storedClients) {
        setClients(JSON.parse(storedClients));
      } else {
        // Optional: Seed localStorage if empty
        localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(mockClientsData));
        setClients(mockClientsData); // Ensure state matches if seeded
      }
    } catch (error) {
      console.error("Error loading clients from localStorage:", error);
      // Fallback to mock data if error
      setClients(mockClientsData);
      localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(mockClientsData));
    }
  }, []); // Empty dependency array ensures it runs only once on mount

  // Save clients to localStorage whenever the state changes
  useEffect(() => {
    try {
        // Convert clients state to JSON and save
        localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    } catch (error) {
      console.error("Error saving clients to localStorage:", error);
    }
  }, [clients]); // Run whenever clients state changes


  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
       label: "", contactPerson: "", email: "", phone: "", address: "", category: ""
    }
  });

  // Effect for populating the EDIT form
  React.useEffect(() => {
    if (clientToEdit && isEditDialogOpen) {
      // Map Client fields to ClientFormValues for the form
      form.reset({
        label: clientToEdit.label,
        contactPerson: clientToEdit.contactPerson,
        email: clientToEdit.email,
        phone: clientToEdit.phone, // Use clientToEdit.phone directly
        address: clientToEdit.address,
        category: clientToEdit.category,
      });
    } else if (!isEditDialogOpen) {
      // Reset form when closing edit dialog or for the 'Add New' tab
      form.reset({ label: "", contactPerson: "", email: "", phone: "", address: "", category: "" });
    }
  }, [clientToEdit, isEditDialogOpen, form]);


  function onSubmit(data: ClientFormValues) {
    if (clientToEdit) {
      // --- Editing Existing Client ---
      setClients(clients.map(c => c.id === clientToEdit.id ? {
          ...clientToEdit, // Spread existing full client data
          label: data.label, // Update with form values
          contactPerson: data.contactPerson,
          email: data.email || '', // Ensure email is string or empty string
          phone: data.phone,
          address: data.address || '', // Ensure address is string or empty string
          category: data.category,
         } : c));
      toast({ title: "Client Updated", description: `Client "${data.label}" updated successfully.` });
      setIsEditDialogOpen(false); // Close edit dialog
      setClientToEdit(null);
    } else {
      // --- Adding New Client ---
      const newClientId = `client_${Date.now()}`;
      const newClient: Client = {
        id: newClientId,
        value: newClientId, // Use the same ID for value
        label: data.label, // Use 'label' from form
        contactPerson: data.contactPerson,
        email: data.email || '',
        phone: data.phone,
        address: data.address || '',
        category: data.category,
        totalRevenue: 0,
        status: data.category === "New Lead" ? "Lead" : "Active" // Basic status logic
      };
      setClients(prevClients => [...prevClients, newClient]); // Use functional update for safety
      toast({ title: "Client Added", description: `Client "${data.label}" added successfully.` });
      form.reset({ label: "", contactPerson: "", email: "", phone: "", address: "", category: "" }); // Reset the 'Add New' form
      setActiveTab("all-clients"); // Switch back to the list view
    }
  }

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast({ title: "Client Deleted", description: "Client has been deleted.", variant: "destructive" });
  };

  const openEditDialog = (client: Client) => {
    setClientToEdit(client);
    setIsEditDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) { // Add null check for status
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
        <h1 className="text-3xl font-semibold text-foreground mb-8">Clients</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all-clients">All Clients</TabsTrigger>
              <TabsTrigger value="add-client">Add New Client</TabsTrigger>
            </TabsList>
            {activeTab === 'all-clients' && (
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
                    {/* Removed Add Client Button here */}
                </div>
            )}
          </div>

          <TabsContent value="all-clients">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-xs text-muted-foreground">{clients.filter(c => c.status === 'Active').length} active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Client Revenue (YTD)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Across all clients</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Leads (This Month)</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
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
                              <AvatarImage src={client.avatarUrl} alt={client.label} data-ai-hint="company logo person" />
                              <AvatarFallback>{client.label.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {client.label}
                          </div>
                        </TableCell>
                        <TableCell><a href={`mailto:${client.email}`} className="text-primary hover:underline flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {client.email || 'N/A'}</a></TableCell>
                        <TableCell><a href={`tel:${client.phone}`} className="text-primary hover:underline flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {client.phone || 'N/A'}</a></TableCell> {/* Use client.phone */}
                        <TableCell><Badge variant="outline">{client.category || 'N/A'}</Badge></TableCell>
                        <TableCell className="text-right">${(client.totalRevenue || 0).toFixed(2)}</TableCell>
                        <TableCell><Badge className={getStatusBadgeVariant(client.status || '')}>{client.status || 'N/A'}</Badge></TableCell> {/* Add null check for status */}
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
                                <Link href={`/invoices/new?client=${client.value}`}> {/* Use client.value */}
                                  <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quotations/new?client=${client.value}`}> {/* Use client.value */}
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
                    No clients found. Add one using the 'Add New Client' tab.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-client">
            <Card>
              <CardHeader>
                <CardTitle>Add New Client</CardTitle>
                <CardDescription>Enter the details for the new client.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  {/* Use onSubmit directly here */}
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                     <FormField control={form.control} name="label" render={({ field }) => ( // Use 'label' for name field
                        <FormItem><FormLabel>Client Name *</FormLabel><FormControl><Input {...field} placeholder="Acme Corporation"/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="contactPerson" render={({ field }) => (
                        <FormItem><FormLabel>Contact Person (Optional)</FormLabel><FormControl><Input {...field} placeholder="John Doe"/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email (Optional)</FormLabel><FormControl><Input type="email" {...field} placeholder="contact@acme.com"/></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input type="tel" {...field} placeholder="555-1234"/></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Address (Optional)</FormLabel><FormControl><Textarea {...field} rows={3} placeholder="123 Main St, Anytown USA"/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Category (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {clientCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select><FormMessage /></FormItem>
                    )}/>
                    <div className="flex justify-end pt-4">
                      <Button type="submit"><Save className="mr-2 h-4 w-4"/> Add Client</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog for Editing - remains largely the same, ensure field names match */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Update the client's details.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              {/* Ensure this form also uses onSubmit */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* FormFields are identical to the Add New form */}
                 <FormField control={form.control} name="label" render={({ field }) => ( // Use 'label'
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
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {clientCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select><FormMessage /></FormItem>
                )}/>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit"><Save className="mr-2 h-4 w-4"/> Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
}
