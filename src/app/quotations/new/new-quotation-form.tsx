
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Kept for potential direct use, though FormLabel is primary
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { CalendarIcon, PlusCircle, Trash2, Eye, Save, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form"; // Controller removed as not directly used
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // FormDescription removed as not used
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from 'next/navigation';
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
// Import mock data
import {
  initialClients,
  initialItems,
  companyDetails,
  TAX_RATE,
  type Client,
  type Item
} from "@/data/mockData";

const quotationItemSchema = z.object({
  description: z.string().min(1, "Item description is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  unitPrice: z.coerce.number().positive("Unit price must be positive."),
});

const quotationFormSchema = z.object({
  client: z.string().min(1, "Client selection is required."),
  quotationNumber: z.string().min(1, "Quotation number is required."),
  issueDate: z.date({ required_error: "Issue date is required." }),
  expiryDate: z.date({ required_error: "Expiry date is required." }),
  items: z.array(quotationItemSchema).min(1, "At least one item is required."),
  notes: z.string().optional(),
});

type QuotationFormValues = z.infer<typeof quotationFormSchema>;

interface PreviewData extends QuotationFormValues {
  subtotal: number;
  taxAmount: number;
  total: number;
  clientDetails?: Client;
  companyDetails: typeof companyDetails;
}


interface SelectableItem {
  value: string;
  label: string;
  price: number;
}

export default function NewQuotationForm() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  // Use mock data directly
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [availableItems, setAvailableItems] = useState<SelectableItem[]>(
    initialItems.map(item => ({
        value: item.id,
        label: item.name,
        price: item.salePrice ?? 0
    }))
  );
  const [subtotal, setSubtotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [companyDetailsState] = useState(companyDetails);


  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationFormSchema),
    defaultValues: {
      client: undefined, // Will be set by useEffect if param exists
      quotationNumber: "",
      issueDate: new Date(), // Default to today
      expiryDate: (() => { // Default to 30 days from today
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        return futureDate;
      })(),
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "This quotation is valid for 30 days.",
    },
  });

  useEffect(() => {
    // Set quotationNumber and client based on searchParams after mount
    if (!form.getValues("quotationNumber")) {
      form.setValue("quotationNumber", `QT-${String(Date.now()).slice(-4)}`);
    }
    const clientParam = searchParams.get('client');
    if (clientParam) { // Check if clientParam exists
        form.setValue("client", clientParam, { shouldValidate: true });
    }
  }, [form, searchParams]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  useEffect(() => {
    let currentSubtotal = 0;
    watchedItems.forEach(item => {
      currentSubtotal += (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    });
    setSubtotal(currentSubtotal);
    const currentTaxAmount = currentSubtotal * TAX_RATE;
    setTaxAmount(currentTaxAmount);
    setTotal(currentSubtotal + currentTaxAmount);
  }, [watchedItems]);


  function onSubmit(data: QuotationFormValues) {
    console.log("Sending Quotation:", { ...data, subtotal, taxAmount, total });
    toast({
      title: "Quotation Sent (Mock)",
      description: `Quotation ${data.quotationNumber} for ${clients.find(c => c.value === data.client)?.label} has been 'sent'.`,
    });
    resetForm();
  }

  const handleSaveDraft = () => {
    const data = form.getValues();
    if (!data.items || data.items.length === 0 || data.items.every(item => !item.description)) {
         toast({
            title: "Cannot Save Draft",
            description: "Please add at least one item to the quotation.",
            variant: "destructive",
        });
        return;
    }
    console.log("Saving Draft:", { ...data, subtotal, taxAmount, total });
    toast({
      title: "Quotation Draft Saved (Mock)",
      description: `Quotation ${data.quotationNumber} has been 'saved' as a draft.`,
    });
  };

  const handlePreview = () => {
    form.trigger().then(isValid => {
        if (!isValid) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields before previewing.",
                variant: "destructive",
            });
            return;
        }
        const data = form.getValues();
        const clientDetails = clients.find(c => c.value === data.client);
        const fullPreviewData: PreviewData = {
            ...data,
            subtotal,
            taxAmount,
            total,
            clientDetails: clientDetails || undefined,
            companyDetails: companyDetailsState
        };
        setPreviewData(fullPreviewData);
        setIsPreviewOpen(true);
        console.log("Previewing Quotation:", fullPreviewData);
    });
  };

  const handleItemDescriptionChange = (index: number, value: string) => {
    const selectedItem = availableItems.find(item => item.label.toLowerCase() === value.toLowerCase());
    if (selectedItem) {
      form.setValue(`items.${index}.description`, selectedItem.label);
      form.setValue(`items.${index}.unitPrice`, selectedItem.price);
    } else {
       form.setValue(`items.${index}.description`, value);
    }
  };

  const resetForm = () => {
     const futureDate = new Date();
     futureDate.setDate(futureDate.getDate() + 30);
    form.reset({
      client: searchParams.get('client') || undefined,
      quotationNumber: `QT-${String(Date.now()).slice(-4)}`,
      issueDate: new Date(),
      expiryDate: futureDate,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "This quotation is valid for 30 days.",
    });
  };


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             <Card>
              <CardHeader>
                <CardTitle>Create New Quotation</CardTitle>
                <CardDescription>Fill in the details to generate a new quotation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
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
                    name="quotationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quotation Number</FormLabel>
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
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date</FormLabel>
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
                <CardTitle>Quotation Items</CardTitle>
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
                                 <FormControl>
                                    <Input
                                       placeholder="Item or Service description"
                                       {...field}
                                       list={`datalist-items-${index}`}
                                       onChange={(e) => {
                                         handleItemDescriptionChange(index, e.target.value);
                                     }}
                                     />
                                 </FormControl>
                                 <datalist id={`datalist-items-${index}`}>
                                     {availableItems.map(ai => (
                                         <option key={ai.value} value={ai.label} />
                                     ))}
                                 </datalist>
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
                              <FormItem><FormControl><Input type="number" {...field} min="1"/></FormControl><FormMessage /></FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem><FormControl><Input type="number" {...field} step="0.01" min="0"/></FormControl><FormMessage /></FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          ${((Number(watchedItems[index]?.quantity) || 0) * (Number(watchedItems[index]?.unitPrice) || 0)).toFixed(2)}
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
                        <Textarea placeholder="e.g., This quotation is valid for 30 days." {...field} rows={4}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="button" variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" /> Preview Quotation
              </Button>
              <Button type="button" variant="secondary" onClick={handleSaveDraft}>
                <Save className="mr-2 h-4 w-4" /> Save Draft
              </Button>
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Send Quotation
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="w-full max-w-xl sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Quotation Preview</SheetTitle>
            <SheetDescription>Review the quotation before sending.</SheetDescription>
          </SheetHeader>
          <div className="py-6 px-2">
            {previewData ? (
              <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{previewData.companyDetails.name}</h2>
                    <p className="text-sm text-muted-foreground">{previewData.companyDetails.address}</p>
                    <p className="text-sm text-muted-foreground">{previewData.companyDetails.email} | {previewData.companyDetails.phone}</p>
                  </div>
                   <div className="text-right">
                    {previewData.companyDetails.logoUrl && (
                         <Image src={previewData.companyDetails.logoUrl} alt="Company Logo" width={100} height={40} className="h-10 w-auto mb-2 ml-auto object-contain" data-ai-hint={previewData.companyDetails.aiHint}/>
                     )}
                    <h3 className="text-xl font-semibold">QUOTATION</h3>
                    <p className="text-sm text-muted-foreground"># {previewData.quotationNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <h4 className="font-semibold mb-1">Prepared For:</h4>
                    {previewData.clientDetails ? (
                       <>
                        <p>{previewData.clientDetails.label}</p>
                        <p className="text-sm text-muted-foreground">{previewData.clientDetails.address}</p>
                        <p className="text-sm text-muted-foreground">{previewData.clientDetails.email}</p>
                       </>
                    ) : (
                       <p className="text-destructive">Client details not found.</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p><span className="font-semibold">Issue Date:</span> {previewData.issueDate ? format(previewData.issueDate, "PPP") : 'N/A'}</p>
                    <p><span className="font-semibold">Valid Until:</span> {previewData.expiryDate ? format(previewData.expiryDate, "PPP") : 'N/A'}</p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">{Number(item.quantity) || 0}</TableCell>
                        <TableCell className="text-right">${(Number(item.unitPrice) || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-right">${((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-6">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>${previewData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax ({ (TAX_RATE * 100).toFixed(0) }%):</span>
                      <span>${previewData.taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Estimated Total:</span>
                      <span>${previewData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {previewData.notes && (
                  <div className="mt-8 pt-4 border-t">
                    <h4 className="font-semibold mb-1">Notes:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{previewData.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading preview data...</p>
            )}
          </div>
           <SheetFooter className="p-4 border-t">
             <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
           </SheetFooter>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
