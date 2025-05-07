
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, Users, MoreHorizontal, Mail, Phone, DollarSign, Save, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
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
// Import Client interface and categories from mockData, but not the data itself
import { clientCategories, type Client } from "@/data/mockData";
import { createClient } from "@/lib/supabase/client"; // Import Supabase client

const clientFormSchema = z.object({
  label: z.string().min(1, "Client name is required."),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("all-clients");
  const { toast } = useToast();
  const supabase = createClient();

  // Fetch clients from Supabase on mount
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('clients') // Assume 'clients' table exists
          .select('*')
          .order('label', { ascending: true }); // Adjust columns as needed

        if (error) {
          throw error;
        }
        // Map Supabase data to Client interface if needed, ensure 'value' is set
        const formattedData = data.map(c => ({ ...c, value: c.id, label: c.label })) as Client[];
        setClients(formattedData);
      } catch (error: any) {
        console.error("Error loading clients from Supabase:", error);
        toast({
          title: "Error Loading Clients",
          description: error.message || "Could not fetch client data.",
          variant: "destructive",
        });
        setClients([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [toast, supabase]); // Add supabase and toast to dependency array

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
       label: "", contactPerson: "", email: "", phone: "", address: "", category: ""
    }
  });

  // Effect for populating the EDIT form
  React.useEffect(() => {
    if (clientToEdit && isEditDialogOpen) {
      form.reset({
        label: clientToEdit.label,
        contactPerson: clientToEdit.contactPerson,
        email: clientToEdit.email,
        phone: clientToEdit.phone,
        address: clientToEdit.address,
        category: clientToEdit.category,
      });
    } else if (!isEditDialogOpen) {
      form.reset({ label: "", contactPerson: "", email: "", phone: "", address: "", category: "" });
    }
  }, [clientToEdit, isEditDialogOpen, form]);

  async function onSubmit(data: ClientFormValues) {
    setIsLoading(true);
    try {
        if (clientToEdit) {
            // --- Editing Existing Client ---
            const { data: updatedData, error } = await supabase
                .from('clients')
                .update({
                    label: data.label,
                    contactPerson: data.contactPerson,
                    email: data.email || null, // Use null for empty optional fields in DB
                    phone: data.phone || null,
                    address: data.address || null,
                    category: data.category || null,
                    // Update other relevant fields if needed
                })
                .eq('id', clientToEdit.id)
                .select()
                .single(); // Get the updated record back

            if (error) throw error;

            if (updatedData) {
                setClients(clients.map(c => c.id === clientToEdit.id ? { ...updatedData, value: updatedData.id } as Client : c));
                toast({ title: "Client Updated", description: `Client "${data.label}" updated successfully.` });
                setIsEditDialogOpen(false);
                setClientToEdit(null);
            }
        } else {
            // --- Adding New Client ---
            const newClientData = {
                label: data.label,
                contactPerson: data.contactPerson || null,
                email: data.email || null,
                phone: data.phone || null,
                address: data.address || null,
                category: data.category || null,
                // Default values for fields not in the form
                totalRevenue: 0,
                status: data.category === "New Lead" ? "Lead" : "Active",
                // avatarUrl can be handled separately if needed
            };

            const { data: insertedData, error } = await supabase
                .from('clients')
                .insert(newClientData)
                .select()
                .single();

            if (error) throw error;

            if (insertedData) {
                 // Add 'value' field matching 'id' for consistency
                const formattedInsertedData = { ...insertedData, value: insertedData.id } as Client;
                setClients(prevClients => [...prevClients, formattedInsertedData]);
                toast({ title: "Client Added", description: `Client "${data.label}" added successfully.` });
                form.reset({ label: "", contactPerson: "", email: "", phone: "", address: "", category: "" }); // Reset the 'Add New' form
                setActiveTab("all-clients"); // Switch back to the list view
            }
        }
    } catch (error: any) {
        console.error("Error saving client:", error);
        toast({
            title: "Error Saving Client",
            description: error.message || "Could not save client data.",
            variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    // Optional: Add a confirmation dialog before deleting
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== clientId));
      toast({ title: "Client Deleted", description: `Client "${clientName}" has been deleted.`, variant: "destructive" });
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast({
        title: "Error Deleting Client",
        description: error.message || "Could not delete client.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (client: Client) => {
    setClientToEdit(client);
    setIsEditDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
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
                </div>
            )}
          </div>

          <TabsContent value="all-clients">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Summary Cards - Could fetch aggregate data from Supabase */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : clients.length}</div>
                   {!isLoading && <p className="text-xs text-muted-foreground">{clients.filter(c => c.status === 'Active').length} active</p>}
                </CardContent>
              </Card>
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Client Revenue (YTD)</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {/* Aggregate revenue fetch needed */}
                  <div className="text-2xl font-bold">${isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0).toFixed(2)}</div>
                  {!isLoading && <p className="text-xs text-muted-foreground">Across all clients</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Leads (This Month)</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                   <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : clients.filter(c => c.status === 'Lead').length}</div>
                  {!isLoading && <p className="text-xs text-muted-foreground">Potential new business</p>}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Clients</CardTitle>
                <CardDescription>Manage your client relationships and information.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Loading clients...</span>
                    </div>
                ) : (
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
                        <TableCell><a href={`tel:${client.phone}`} className="text-primary hover:underline flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {client.phone || 'N/A'}</a></TableCell>
                        <TableCell><Badge variant="outline">{client.category || 'N/A'}</Badge></TableCell>
                        <TableCell className="text-right">${(client.totalRevenue || 0).toFixed(2)}</TableCell>
                        <TableCell><Badge className={getStatusBadgeVariant(client.status || '')}>{client.status || 'N/A'}</Badge></TableCell>
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
                                {/* Ensure client.value exists and is correct ID */}
                                <Link href={`/invoices/new?client=${client.value}`}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                {/* Ensure client.value exists and is correct ID */}
                                <Link href={`/quotations/new?client=${client.value}`}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Create Quotation
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => handleDeleteClient(client.id, client.label)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 )}
                {!isLoading && clients.length === 0 && (
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                     <FormField control={form.control} name="label" render={({ field }) => (
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
                      <Button type="submit" disabled={isLoading}>
                         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                         Add Client
                       </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Update the client's details.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                 <FormField control={form.control} name="label" render={({ field }) => (
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
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  );
}
