
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const taxRateSchema = z.object({
  name: z.string().min(1, "Tax rate name is required."),
  rate: z.coerce.number().min(0, "Rate must be non-negative.").max(100, "Rate cannot exceed 100."),
  region: z.string().optional(), // e.g., "California", "VAT EU"
  isCompound: z.boolean().default(false),
});

type TaxRateFormValues = z.infer<typeof taxRateSchema>;

interface TaxRate extends TaxRateFormValues {
  id: string;
}

const initialTaxRates: TaxRate[] = [
  { id: "tax_1", name: "Standard Sales Tax", rate: 7.25, region: "California", isCompound: false },
  { id: "tax_2", name: "VAT", rate: 20, region: "United Kingdom", isCompound: false },
  { id: "tax_3", name: "Service Tax", rate: 5, region: "", isCompound: false },
];

export default function TaxSettingsPage() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(initialTaxRates);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTaxRate, setEditingTaxRate] = useState<TaxRate | null>(null);
  const { toast } = useToast();

  const form = useForm<TaxRateFormValues>({
    resolver: zodResolver(taxRateSchema),
  });

  React.useEffect(() => {
    if (editingTaxRate) {
      form.reset(editingTaxRate);
    } else {
      form.reset({ name: "", rate: 0, region: "", isCompound: false });
    }
  }, [editingTaxRate, form, isDialogOpen]);


  function onSubmit(data: TaxRateFormValues) {
    if (editingTaxRate) {
      setTaxRates(taxRates.map(tr => tr.id === editingTaxRate.id ? { ...editingTaxRate, ...data } : tr));
      toast({ title: "Tax Rate Updated", description: `Tax rate "${data.name}" updated successfully.` });
    } else {
      const newTaxRate: TaxRate = { id: `tax_${Date.now()}`, ...data };
      setTaxRates([...taxRates, newTaxRate]);
      toast({ title: "Tax Rate Added", description: `Tax rate "${data.name}" added successfully.` });
    }
    setIsDialogOpen(false);
    setEditingTaxRate(null);
  }

  const handleDeleteTaxRate = (taxRateId: string) => {
    setTaxRates(taxRates.filter(tr => tr.id !== taxRateId));
    toast({ title: "Tax Rate Deleted", description: "Tax rate has been deleted.", variant: "destructive" });
  };
  
  const openEditDialog = (taxRate: TaxRate) => {
    setEditingTaxRate(taxRate);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingTaxRate(null);
    setIsDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Tax Settings</h1>
          <Button onClick={openNewDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Tax Rate
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manage Tax Rates</CardTitle>
            <CardDescription>Configure tax rates for different regions or purposes.</CardDescription>
          </CardHeader>
          <CardContent>
            {taxRates.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Rate (%)</TableHead>
                    <TableHead>Compound</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxRates.map((taxRate) => (
                    <TableRow key={taxRate.id}>
                      <TableCell className="font-medium">{taxRate.name}</TableCell>
                      <TableCell>{taxRate.region || "N/A"}</TableCell>
                      <TableCell className="text-right">{taxRate.rate.toFixed(2)}%</TableCell>
                      <TableCell>{taxRate.isCompound ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => openEditDialog(taxRate)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => handleDeleteTaxRate(taxRate.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No tax rates configured yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTaxRate ? "Edit Tax Rate" : "Add New Tax Rate"}</DialogTitle>
              <DialogDescription>
                {editingTaxRate ? "Update the details for this tax rate." : "Define a new tax rate."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Sales Tax, VAT" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate (%)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 7.25" {...field} step="0.01" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region (Optional)</FormLabel>
                      <FormControl><Input placeholder="e.g., California, EU" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* TODO: Add isCompound Checkbox field */}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingTaxRate ? "Save Changes" : "Add Tax Rate"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
