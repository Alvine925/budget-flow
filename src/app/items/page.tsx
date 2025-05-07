
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, Filter, Package, Briefcase, MoreHorizontal, DollarSign, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
// Import Item interface but not the mock data
import type { Item } from "@/data/mockData";
import { createClient } from "@/lib/supabase/client"; // Import Supabase client

const itemFormSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  sku: z.string().optional(),
  type: z.enum(["service", "stock_item"], { required_error: "Item type is required."}),
  description: z.string().optional(),
  salePrice: z.coerce.number().min(0, "Sale price must be non-negative.").optional(),
  purchasePrice: z.coerce.number().min(0, "Purchase price must be non-negative.").optional(),
  trackInventory: z.boolean().default(false),
  currentStock: z.coerce.number().min(0, "Stock must be non-negative.").optional(),
  lowStockThreshold: z.coerce.number().min(0, "Threshold must be non-negative.").optional(),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

// No longer need initialItems with mock data

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

   // Load items from Supabase on mount
   useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('items') // Assume 'items' table exists
          .select('*')
          .order('name', { ascending: true }); // Adjust columns as needed

        if (error) throw error;
        setItems(data as Item[]); // Assuming Supabase data structure matches Item interface
      } catch (error: any) {
        console.error("Error loading items from Supabase:", error);
        toast({
          title: "Error Loading Items",
          description: error.message || "Could not fetch item data.",
          variant: "destructive",
        });
        setItems([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [supabase, toast]); // Add dependencies

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
  });

  const itemType = form.watch("type");
  const trackInventory = form.watch("trackInventory");

  React.useEffect(() => {
    if (editingItem) {
      form.reset(editingItem);
    } else {
      form.reset({ name: "", sku: "", type: "service", description: "", salePrice: 0, purchasePrice: 0, trackInventory: false, currentStock: 0, lowStockThreshold: 0 });
    }
  }, [editingItem, form, isDialogOpen]);

  async function onSubmit(data: ItemFormValues) {
    setIsLoading(true);
    try {
        const itemData = { ...data }; // Copy data to avoid modifying original form values
        if (!itemData.trackInventory) {
            itemData.currentStock = undefined;
            itemData.lowStockThreshold = undefined;
        }

        // Prepare data for Supabase (handle undefined -> null)
        const supabaseData = {
            ...itemData,
            salePrice: itemData.salePrice ?? null,
            purchasePrice: itemData.purchasePrice ?? null,
            currentStock: itemData.trackInventory ? (itemData.currentStock ?? 0) : null,
            lowStockThreshold: itemData.trackInventory ? (itemData.lowStockThreshold ?? 0) : null,
            sku: itemData.sku || null,
            description: itemData.description || null,
        };

        if (editingItem) {
            // --- Editing Existing Item ---
            const { data: updatedData, error } = await supabase
                .from('items')
                .update(supabaseData)
                .eq('id', editingItem.id)
                .select()
                .single();

            if (error) throw error;
            if (updatedData) {
                setItems(items.map(i => i.id === editingItem.id ? { ...updatedData } as Item : i));
                toast({ title: "Item Updated", description: `Item "${data.name}" updated successfully.` });
            }
        } else {
            // --- Adding New Item ---
            const { data: insertedData, error } = await supabase
                .from('items')
                .insert(supabaseData)
                .select()
                .single();

            if (error) throw error;
            if (insertedData) {
                setItems(prevItems => [...prevItems, insertedData as Item]);
                toast({ title: "Item Added", description: `Item "${data.name}" added successfully.` });
            }
        }
        setIsDialogOpen(false);
        setEditingItem(null);
        form.reset(); // Reset form after successful operation
    } catch (error: any) {
        console.error("Error saving item:", error);
        toast({
            title: "Error Saving Item",
            description: error.message || "Could not save item data.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    // Optional: Add confirmation dialog
    setIsLoading(true);
    try {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', itemId);

        if (error) throw error;

        setItems(items.filter(i => i.id !== itemId));
        toast({ title: "Item Deleted", description: `Item "${itemName}" has been deleted.`, variant: "destructive" });
    } catch (error: any) {
        console.error("Error deleting item:", error);
        toast({
            title: "Error Deleting Item",
            description: error.message || "Could not delete item.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const openEditDialog = (item: Item) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingItem(null);
    form.reset({ name: "", sku: "", type: "service", description: "", salePrice: 0, purchasePrice: 0, trackInventory: false, currentStock: 0, lowStockThreshold: 0 }); // Ensure form is reset
    setIsDialogOpen(true);
  };


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Items & Services</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search items or services..." className="max-w-sm" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Type
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Services</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Stock Items</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item/Service
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Items & Services</CardTitle>
            <CardDescription>Manage your product catalog and service offerings.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                 <div className="flex justify-center items-center py-10">
                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <span className="ml-2">Loading items...</span>
                 </div>
             ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Sale Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === "service" ? "secondary" : "default"}>
                        {item.type === "service" ? <Briefcase className="mr-1.5 h-3 w-3" /> : <Package className="mr-1.5 h-3 w-3" />}
                        {item.type === "service" ? "Service" : "Stock Item"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.salePrice ? `$${item.salePrice.toFixed(2)}` : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      {item.trackInventory ? (
                        <span className={item.currentStock !== undefined && item.lowStockThreshold !== undefined && (item.currentStock || 0) <= item.lowStockThreshold ? "text-destructive font-semibold" : ""}>
                            {item.currentStock ?? 0}
                        </span>
                       ) : "N/A"}
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
                           <DropdownMenuItem onClick={() => openEditDialog(item)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {item.type === "stock_item" && item.trackInventory && (
                             <DropdownMenuItem asChild>
                               <Link href={`/inventory?item=${item.id}`}>
                                <Package className="mr-2 h-4 w-4" /> View Inventory
                               </Link>
                             </DropdownMenuItem>
                          )}
                           <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => handleDeleteItem(item.id, item.name)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             )}
            {!isLoading && items.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No items or services found.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item/Service" : "Add New Item/Service"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the details for this item/service." : "Define a new item or service."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Type *</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); if(value === "service") form.setValue("trackInventory", false); }} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="service">Service</SelectItem><SelectItem value="stock_item">Stock Item</SelectItem></SelectContent>
                        </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="sku" render={({ field }) => (
                    <FormItem><FormLabel>SKU (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="salePrice" render={({ field }) => (
                        <FormItem><FormLabel>Sale Price (Optional)</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                        <FormItem><FormLabel>Purchase Price (Optional)</FormLabel><FormControl><Input type="number" {...field} step="0.01" /></FormControl><FormMessage /></FormItem>
                    )}/>
                 </div>

                {itemType === "stock_item" && (
                  <FormField control={form.control} name="trackInventory" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow mt-4">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                              <FormLabel>Track Inventory for this item</FormLabel>
                              <FormDescription>Enable to manage stock levels.</FormDescription>
                          </div>
                      </FormItem>
                  )}/>
                )}

                {itemType === "stock_item" && trackInventory && (
                    <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
                        <FormField control={form.control} name="currentStock" render={({ field }) => (
                            <FormItem><FormLabel>Current Stock (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="lowStockThreshold" render={({ field }) => (
                            <FormItem><FormLabel>Low Stock Threshold (Optional)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                )}
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingItem ? "Save Changes" : "Add Item/Service"}
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
