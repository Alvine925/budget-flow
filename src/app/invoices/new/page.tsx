
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, PlusCircle, Trash2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  unitPrice: z.coerce.number().positive("Unit price must be positive."),
  // total will be calculated
});

const invoiceFormSchema = z.object({
  client: z.string().min(1, "Client selection is required."),
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  issueDate: z.date({ required_error: "Issue date is required." }),
  dueDate: z.date({ required_error: "Due date is required." }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required."),
  notes: z.string().optional(),
  // subtotal, tax, total will be calculated
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// Mock data
const clients = [
  { value: "client_1", label: "Acme Corp" },
  { value: "client_2", label: "Beta Solutions" },
  { value: "client_3", label: "Gamma Inc." },
];

const availableItems = [
  { value: "item_1", label: "Web Design Service", price: 1200 },
  { value: "item_2", label: "Consulting Hours", price: 150 },
  { value: "item_3", label: "Software License", price: 500 },
  { value: "item_4", label: "Custom Development", price: 80 },
];

const TAX_RATE = 0.1; // Example 10% tax rate

export default function NewInvoicePage() {
  const { toast } = useToast();
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: `INV-${String(Date.now()).slice(-4)}`, // Auto-generate
      issueDate: new Date(),
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "Thank you for your business!",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  useEffect(() => {
    let currentSubtotal = 0;
    watchedItems.forEach(item => {
      currentSubtotal += (item.quantity || 0) * (item.unitPrice || 0);
    });
    setSubtotal(currentSubtotal);
    const currentTaxAmount = currentSubtotal * TAX_RATE;
    setTaxAmount(currentTaxAmount);
    setTotal(currentSubtotal + currentTaxAmount);
  }, [watchedItems]);


  function onSubmit(data: InvoiceFormValues) {
    console.log({ ...data, subtotal, taxAmount, total });
    toast({
      title: "Invoice Created",
      description: `Invoice ${data.invoiceNumber} for ${clients.find(c => c.value === data.client)?.label} has been successfully created.`,
    });
    form.reset();
  }
  
  const handleItemDescriptionChange = (index: number, value: string) => {
    const selectedItem = availableItems.find(item => item.value === value);
    if (selectedItem) {
      form.setValue(`items.${index}.description`, selectedItem.label);
      form.setValue(`items.${index}.unitPrice`, selectedItem.price);
    } else {
       form.setValue(`items.${index}.description`, ''); // Or handle custom entry
       form.setValue(`items.${index}.unitPrice`, 0);
    }
  };


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Create New Invoice</CardTitle>
                <CardDescription>Fill in the details to generate a new invoice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.value} value={client.value}>
                                {client.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Issue Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                              >
                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}
                              >
                                {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                           <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={(value) => {
                                  field.onChange(value); // Keep RHF happy
                                  handleItemDescriptionChange(index, value);
                                }} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select or type item" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableItems.map(ai => (
                                      <SelectItem key={ai.value} value={ai.value}>
                                        {ai.label}
                                      </SelectItem>
                                    ))}
                                     <SelectItem value="custom">Custom Item</SelectItem>
                                  </SelectContent>
                                </Select>
                                {field.value === 'custom' || !availableItems.find(i => i.value === field.value) && (
                                  <Input 
                                    className="mt-1"
                                    placeholder="Custom item description"
                                    defaultValue={form.getValues(`items.${index}.description`)}
                                    onChange={(e) => form.setValue(`items.${index}.description`, e.target.value)}
                                  />
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem><FormControl><Input type="number" {...field} step="0.01" /></FormControl><FormMessage /></FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ${((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
                {form.formState.errors.items && !form.formState.errors.items.message && (
                   <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.root?.message || "Please add at least one item."}</p>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-end space-y-2 pt-6 border-t">
                 <div className="flex justify-between w-full max-w-xs">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs">
                    <span className="text-muted-foreground">Tax ({ (TAX_RATE * 100).toFixed(0) }%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes / Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Payment is due within 30 days. Late fees may apply." {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
              <Button type="submit">Create Invoice</Button>
              <Button type="button" variant="secondary" onClick={() => console.log("Save as Draft")}>Save as Draft</Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
