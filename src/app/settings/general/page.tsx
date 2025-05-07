
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const generalSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  companyEmail: z.string().email("Invalid email address.").min(1, "Company email is required."),
  companyPhone: z.string().optional(),
  companyAddress: z.string().optional(),
  defaultCurrency: z.string().min(1, "Default currency is required."),
  dateFormat: z.string().min(1, "Date format is required."),
  timezone: z.string().min(1, "Timezone is required."),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

const currencies = [
  { value: "USD", label: "USD - United States Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound Sterling" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CNY", label: "CNY - Chinese Yuan Renminbi" },
  { value: "HKD", label: "HKD - Hong Kong Dollar" },
  { value: "NZD", label: "NZD - New Zealand Dollar" },
  { value: "SEK", label: "SEK - Swedish Krona" },
  { value: "KRW", label: "KRW - South Korean Won" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
  { value: "NOK", label: "NOK - Norwegian Krone" },
  { value: "MXN", label: "MXN - Mexican Peso" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "RUB", label: "RUB - Russian Ruble" },
  { value: "ZAR", label: "ZAR - South African Rand" },
  { value: "TRY", label: "TRY - Turkish Lira" },
  { value: "BRL", label: "BRL - Brazilian Real" },
  { value: "TWD", label: "TWD - New Taiwan Dollar" },
  { value: "DKK", label: "DKK - Danish Krone" },
  { value: "PLN", label: "PLN - Polish Złoty" },
  { value: "THB", label: "THB - Thai Baht" },
  { value: "IDR", label: "IDR - Indonesian Rupiah" },
  { value: "HUF", label: "HUF - Hungarian Forint" },
  { value: "CZK", label: "CZK - Czech Koruna" },
  { value: "ILS", label: "ILS - Israeli New Shekel" },
  { value: "CLP", label: "CLP - Chilean Peso" },
  { value: "PHP", label: "PHP - Philippine Peso" },
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "COP", label: "COP - Colombian Peso" },
  { value: "SAR", label: "SAR - Saudi Riyal" },
  { value: "MYR", label: "MYR - Malaysian Ringgit" },
  { value: "RON", label: "RON - Romanian Leu" },
  { value: "VND", label: "VND - Vietnamese Đồng" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "UAH", label: "UAH - Ukrainian Hryvnia" },
  { value: "ARS", label: "ARS - Argentine Peso" },
  { value: "IQD", label: "IQD - Iraqi Dinar" },
  { value: "KWD", label: "KWD - Kuwaiti Dinar" },
  { value: "QAR", label: "QAR - Qatari Riyal" },
  { value: "OMR", label: "OMR - Omani Rial" },
  { value: "BHD", label: "BHD - Bahraini Dinar" },
  { value: "JOD", label: "JOD - Jordanian Dinar" },
  { value: "EGP", label: "EGP - Egyptian Pound" },
  { value: "LBP", label: "LBP - Lebanese Pound" },
  { value: "MAD", label: "MAD - Moroccan Dirham" },
  { value: "PKR", label: "PKR - Pakistani Rupee" },
  { value: "BDT", label: "BDT - Bangladeshi Taka" },
  { value: "LKR", label: "LKR - Sri Lankan Rupee" },
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "GHS", label: "GHS - Ghanaian Cedi" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" },
  { value: "UGX", label: "UGX - Ugandan Shilling" }
];


const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "DD-MMM-YYYY", label: "DD-MMM-YYYY"},
  { value: "MMM DD, YYYY", label: "MMM DD, YYYY"},
];

const timezones = [
  { value: "America/New_York", label: "America/New_York (EST/EDT)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST/PDT)"},
  { value: "Europe/Paris", label: "Europe/Paris (CET/CEST)"},
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST/AEDT)"},
  { value: "Asia/Dubai", label: "Asia/Dubai (GST)"},
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)"},
];

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    // Fetch these defaults from user's current settings in a real app
    defaultValues: {
      companyName: "My Business Inc.",
      companyEmail: "contact@mybusiness.com",
      defaultCurrency: "USD",
      dateFormat: "MM/DD/YYYY",
      timezone: "America/New_York",
    },
  });

  function onSubmit(data: GeneralSettingsFormValues) {
    console.log(data);
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your company profile, localization, and basic preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Phone (Optional)</FormLabel>
                        <FormControl><Input type="tel" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Address (Optional)</FormLabel>
                      <FormControl><Textarea {...field} rows={3} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <h3 className="text-lg font-medium pt-4 border-t">Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <FormField
                    control={form.control}
                    name="defaultCurrency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {currencies.map(c => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Format</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select date format" /></SelectTrigger></FormControl>
                          <SelectContent>{dateFormats.map(df => <SelectItem key={df.value} value={df.value}>{df.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger></FormControl>
                          <SelectContent>{timezones.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

