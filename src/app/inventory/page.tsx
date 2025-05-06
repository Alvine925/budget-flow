
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MinusCircle, Edit, Trash2, Filter, Package, AlertTriangle, MoreHorizontal, FilePenLine, History, Truck } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";


interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category?: string;
  currentStock: number;
  lowStockThreshold: number;
  purchasePrice?: number;
  salePrice?: number;
  lastStockUpdate: string;
}

const initialInventory: InventoryItem[] = [
  { id: "item_2", name: "Premium Laptop Model X", sku: "HW-LAP-00X", category: "Electronics", currentStock: 15, lowStockThreshold: 5, purchasePrice: 800, salePrice: 1200, lastStockUpdate: "2024-07-10" },
  { id: "item_4", name: "Wireless Mouse Z", sku: "HW-MOU-00Z", category: "Accessories", currentStock: 50, lowStockThreshold: 10, purchasePrice: 20, salePrice: 45, lastStockUpdate: "2024-07-12" },
  { id: "item_6", name: "Office Chair Pro", sku: "FURN-CHR-PRO", category: "Furniture", currentStock: 8, lowStockThreshold: 3, purchasePrice: 150, salePrice: 250, lastStockUpdate: "2024-07-05" },
  { id: "item_7", name: "Printer Ink Cartridge", sku: "SUP-INK-BLK", category: "Supplies", currentStock: 2, lowStockThreshold: 5, purchasePrice: 15, salePrice: 25, lastStockUpdate: "2024-07-14" },
];

const stockAdjustmentSchema = z.object({
  itemId: z.string(), // Hidden field, set programmatically
  adjustmentType: z.enum(["add", "remove", "set"], { required_error: "Adjustment type is required." }),
  quantity: z.coerce.number().min(0, "Quantity must be non-negative."),
  reason: z.string().optional(),
});
type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>;


export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventory);
  const [isStockAdjustmentDialogOpen, setIsStockAdjustmentDialogOpen] = useState(false);
  const [selectedItemForAdjustment, setSelectedItemForAdjustment] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const stockAdjustmentForm = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
  });

  const openStockAdjustmentDialog = (item: InventoryItem) => {
    setSelectedItemForAdjustment(item);
    stockAdjustmentForm.reset({ itemId: item.id, adjustmentType: "add", quantity: 0, reason: "" });
    setIsStockAdjustmentDialogOpen(true);
  };

  function onStockAdjustSubmit(data: StockAdjustmentFormValues) {
    if (!selectedItemForAdjustment) return;

    setInventoryItems(prevItems => 
      prevItems.map(item => {
        if (item.id === selectedItemForAdjustment.id) {
          let newStock = item.currentStock;
          if (data.adjustmentType === "add") newStock += data.quantity;
          else if (data.adjustmentType === "remove") newStock -= data.quantity;
          else if (data.adjustmentType === "set") newStock = data.quantity;
          
          return { ...item, currentStock: Math.max(0, newStock), lastStockUpdate: new Date().toISOString().split('T')[0] };
        }
        return item;
      })
    );
    toast({ title: "Stock Adjusted", description: `Stock for ${selectedItemForAdjustment.name} updated.` });
    setIsStockAdjustmentDialogOpen(false);
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Inventory Management</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search inventory..." className="max-w-sm" />
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
                <DropdownMenuCheckboxItem>In Stock</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Low Stock</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Out of Stock</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
             {/* <Button disabled> <PlusCircle className="mr-2 h-4 w-4" /> Add New Item (via Items page) </Button> */}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$ {inventoryItems.reduce((sum, item) => sum + (item.currentStock * (item.purchasePrice || 0)), 0).toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Based on purchase price</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items Low on Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{inventoryItems.filter(item => item.currentStock <= item.lowStockThreshold).length}</div>
                    <p className="text-xs text-muted-foreground">Items needing reorder</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{inventoryItems.filter(item => item.currentStock === 0).length}</div>
                     <p className="text-xs text-muted-foreground">Items completely out of stock</p>
                </CardContent>
            </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Current Stock Levels</CardTitle>
            <CardDescription>Monitor and manage your inventory stock.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Low Stock Threshold</TableHead>
                   <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => {
                  const isLowStock = item.currentStock <= item.lowStockThreshold;
                  const isOutOfStock = item.currentStock === 0;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category || "N/A"}</TableCell>
                      <TableCell className="text-right font-semibold">{item.currentStock}</TableCell>
                      <TableCell className="text-right">{item.lowStockThreshold}</TableCell>
                       <TableCell className="text-right">${(item.purchasePrice || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        {isOutOfStock ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : isLowStock ? (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-600">Low Stock</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">In Stock</Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => openStockAdjustmentDialog(item)}>
                                <FilePenLine className="mr-2 h-4 w-4" /> Adjust Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem><History className="mr-2 h-4 w-4" /> View History</DropdownMenuItem>
                            <DropdownMenuItem><Truck className="mr-2 h-4 w-4" /> Create Purchase Order</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                               <Link href={`/items?edit=${item.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Item Details
                               </Link>
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {inventoryItems.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No inventory items being tracked. Add items from the 'Items & Services' page.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isStockAdjustmentDialogOpen} onOpenChange={setIsStockAdjustmentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adjust Stock for {selectedItemForAdjustment?.name}</DialogTitle>
              <DialogDescription>Current Stock: {selectedItemForAdjustment?.currentStock}</DialogDescription>
            </DialogHeader>
            <Form {...stockAdjustmentForm}>
              <form onSubmit={stockAdjustmentForm.handleSubmit(onStockAdjustSubmit)} className="grid gap-4 py-4">
                <FormField control={stockAdjustmentForm.control} name="adjustmentType" render={({ field }) => (
                    <FormItem><FormLabel>Adjustment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="add">Add Stock (Received)</SelectItem>
                                <SelectItem value="remove">Remove Stock (Used/Sold/Damaged)</SelectItem>
                                <SelectItem value="set">Set New Stock Level (Count)</SelectItem>
                            </SelectContent>
                        </Select><FormMessage /></FormItem>
                )}/>
                 <FormField control={stockAdjustmentForm.control} name="quantity" render={({ field }) => (
                    <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={stockAdjustmentForm.control} name="reason" render={({ field }) => (
                    <FormItem><FormLabel>Reason (Optional)</FormLabel><FormControl><Input {...field} placeholder="e.g., Stock count, New shipment" /></FormControl><FormMessage /></FormItem>
                )}/>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsStockAdjustmentDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Adjust Stock</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
