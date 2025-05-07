
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
import React, { useState, useEffect } from "react";
import Image from "next/image";

const generalSettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  companyEmail: z.string().email("Invalid email address.").min(1, "Company email is required."),
  companyPhone: z.string().optional(),
  companyAddress: z.string().optional(),
  logo: z.string().optional().describe("Company logo as a data URI."),
  defaultCurrency: z.string().min(1, "Default currency is required."),
  dateFormat: z.string().min(1, "Date format is required."),
  timezone: z.string().min(1, "Timezone is required."),
});

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

const currencies = [
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "AFN", label: "AFN - Afghan Afghani" },
  { value: "ALL", label: "ALL - Albanian Lek" },
  { value: "AMD", label: "AMD - Armenian Dram" },
  { value: "ANG", label: "ANG - Netherlands Antillean Guilder" },
  { value: "AOA", label: "AOA - Angolan Kwanza" },
  { value: "ARS", label: "ARS - Argentine Peso" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "AWG", label: "AWG - Aruban Florin" },
  { value: "AZN", label: "AZN - Azerbaijani Manat" },
  { value: "BAM", label: "BAM - Bosnia-Herzegovina Convertible Mark" },
  { value: "BBD", label: "BBD - Barbadian Dollar" },
  { value: "BDT", label: "BDT - Bangladeshi Taka" },
  { value: "BGN", label: "BGN - Bulgarian Lev" },
  { value: "BHD", label: "BHD - Bahraini Dinar" },
  { value: "BIF", label: "BIF - Burundian Franc" },
  { value: "BMD", label: "BMD - Bermudan Dollar" },
  { value: "BND", label: "BND - Brunei Dollar" },
  { value: "BOB", label: "BOB - Bolivian Boliviano" },
  { value: "BRL", label: "BRL - Brazilian Real" },
  { value: "BSD", label: "BSD - Bahamian Dollar" },
  { value: "BTN", label: "BTN - Bhutanese Ngultrum" },
  { value: "BWP", label: "BWP - Botswanan Pula" },
  { value: "BYN", label: "BYN - Belarusian Ruble" },
  { value: "BZD", label: "BZD - Belize Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "CDF", label: "CDF - Congolese Franc" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CLP", label: "CLP - Chilean Peso" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "COP", label: "COP - Colombian Peso" },
  { value: "CRC", label: "CRC - Costa Rican Colón" },
  { value: "CUC", label: "CUC - Cuban Convertible Peso" },
  { value: "CUP", label: "CUP - Cuban Peso" },
  { value: "CVE", label: "CVE - Cape Verdean Escudo" },
  { value: "CZK", label: "CZK - Czech Koruna" },
  { value: "DJF", label: "DJF - Djiboutian Franc" },
  { value: "DKK", label: "DKK - Danish Krone" },
  { value: "DOP", label: "DOP - Dominican Peso" },
  { value: "DZD", label: "DZD - Algerian Dinar" },
  { value: "EGP", label: "EGP - Egyptian Pound" },
  { value: "ERN", label: "ERN - Eritrean Nakfa" },
  { value: "ETB", label: "ETB - Ethiopian Birr" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "FJD", label: "FJD - Fijian Dollar" },
  { value: "FKP", label: "FKP - Falkland Islands Pound" },
  { value: "GBP", label: "GBP - British Pound Sterling" },
  { value: "GEL", label: "GEL - Georgian Lari" },
  { value: "GGP", label: "GGP - Guernsey Pound" },
  { value: "GHS", label: "GHS - Ghanaian Cedi" },
  { value: "GIP", label: "GIP - Gibraltar Pound" },
  { value: "GMD", label: "GMD - Gambian Dalasi" },
  { value: "GNF", label: "GNF - Guinean Franc" },
  { value: "GTQ", label: "GTQ - Guatemalan Quetzal" },
  { value: "GYD", label: "GYD - Guyanaese Dollar" },
  { value: "HKD", label: "HKD - Hong Kong Dollar" },
  { value: "HNL", label: "HNL - Honduran Lempira" },
  { value: "HTG", label: "HTG - Haitian Gourde" },
  { value: "HUF", label: "HUF - Hungarian Forint" },
  { value: "IDR", label: "IDR - Indonesian Rupiah" },
  { value: "ILS", label: "ILS - Israeli New Shekel" },
  { value: "IMP", label: "IMP - Isle of Man Pound" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "IQD", label: "IQD - Iraqi Dinar" },
  { value: "IRR", label: "IRR - Iranian Rial" },
  { value: "ISK", label: "ISK - Icelandic Króna" },
  { value: "JEP", label: "JEP - Jersey Pound" },
  { value: "JMD", label: "JMD - Jamaican Dollar" },
  { value: "JOD", label: "JOD - Jordanian Dinar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "KES", label: "KES - Kenyan Shilling" },
  { value: "KGS", label: "KGS - Kyrgystani Som" },
  { value: "KHR", label: "KHR - Cambodian Riel" },
  { value: "KID", label: "KID - Kiribati Dollar" },
  { value: "KMF", label: "KMF - Comorian Franc" },
  { value: "KPW", label: "KPW - North Korean Won" },
  { value: "KRW", label: "KRW - South Korean Won" },
  { value: "KWD", label: "KWD - Kuwaiti Dinar" },
  { value: "KYD", label: "KYD - Cayman Islands Dollar" },
  { value: "KZT", label: "KZT - Kazakhstani Tenge" },
  { value: "LAK", label: "LAK - Laotian Kip" },
  { value: "LBP", label: "LBP - Lebanese Pound" },
  { value: "LKR", label: "LKR - Sri Lankan Rupee" },
  { value: "LRD", label: "LRD - Liberian Dollar" },
  { value: "LSL", label: "LSL - Lesotho Loti" },
  { value: "LYD", label: "LYD - Libyan Dinar" },
  { value: "MAD", label: "MAD - Moroccan Dirham" },
  { value: "MDL", label: "MDL - Moldovan Leu" },
  { value: "MGA", label: "MGA - Malagasy Ariary" },
  { value: "MKD", label: "MKD - Macedonian Denar" },
  { value: "MMK", label: "MMK - Myanma Kyat" },
  { value: "MNT", label: "MNT - Mongolian Tugrik" },
  { value: "MOP", label: "MOP - Macanese Pataca" },
  { value: "MRU", label: "MRU - Mauritanian Ouguiya" },
  { value: "MUR", label: "MUR - Mauritian Rupee" },
  { value: "MVR", label: "MVR - Maldivian Rufiyaa" },
  { value: "MWK", label: "MWK - Malawian Kwacha" },
  { value: "MXN", label: "MXN - Mexican Peso" },
  { value: "MYR", label: "MYR - Malaysian Ringgit" },
  { value: "MZN", label: "MZN - Mozambican Metical" },
  { value: "NAD", label: "NAD - Namibian Dollar" },
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "NIO", label: "NIO - Nicaraguan Córdoba" },
  { value: "NOK", label: "NOK - Norwegian Krone" },
  { value: "NPR", label: "NPR - Nepalese Rupee" },
  { value: "NZD", label: "NZD - New Zealand Dollar" },
  { value: "OMR", label: "OMR - Omani Rial" },
  { value: "PAB", label: "PAB - Panamanian Balboa" },
  { value: "PEN", label: "PEN - Peruvian Sol" },
  { value: "PGK", label: "PGK - Papua New Guinean Kina" },
  { value: "PHP", label: "PHP - Philippine Peso" },
  { value: "PKR", label: "PKR - Pakistani Rupee" },
  { value: "PLN", label: "PLN - Polish Zloty" },
  { value: "PYG", label: "PYG - Paraguayan Guarani" },
  { value: "QAR", label: "QAR - Qatari Rial" },
  { value: "RON", label: "RON - Romanian Leu" },
  { value: "RSD", label: "RSD - Serbian Dinar" },
  { value: "RUB", label: "RUB - Russian Ruble" },
  { value: "RWF", label: "RWF - Rwandan Franc" },
  { value: "SAR", label: "SAR - Saudi Riyal" },
  { value: "SBD", label: "SBD - Solomon Islands Dollar" },
  { value: "SCR", label: "SCR - Seychellois Rupee" },
  { value: "SDG", label: "SDG - Sudanese Pound" },
  { value: "SEK", label: "SEK - Swedish Krona" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
  { value: "SHP", label: "SHP - Saint Helena Pound" },
  { value: "SLE", label: "SLE - Sierra Leonean Leone" },
  { value: "SLL", label: "SLL - Sierra Leonean Leone (Old)" },
  { value: "SOS", label: "SOS - Somali Shilling" },
  { value: "SRD", label: "SRD - Surinamese Dollar" },
  { value: "SSP", label: "SSP - South Sudanese Pound" },
  { value: "STN", label: "STN - São Tomé and Príncipe Dobra" },
  { value: "SYP", label: "SYP - Syrian Pound" },
  { value: "SZL", label: "SZL - Swazi Lilangeni" },
  { value: "THB", label: "THB - Thai Baht" },
  { value: "TJS", label: "TJS - Tajikistani Somoni" },
  { value: "TMT", label: "TMT - Turkmenistani Manat" },
  { value: "TND", label: "TND - Tunisian Dinar" },
  { value: "TOP", label: "TOP - Tongan Paʻanga" },
  { value: "TRY", label: "TRY - Turkish Lira" },
  { value: "TTD", label: "TTD - Trinidad and Tobago Dollar" },
  { value: "TVD", label: "TVD - Tuvaluan Dollar" },
  { value: "TWD", label: "TWD - New Taiwan Dollar" },
  { value: "TZS", label: "TZS - Tanzanian Shilling" },
  { value: "UAH", label: "UAH - Ukrainian Hryvnia" },
  { value: "UGX", label: "UGX - Ugandan Shilling" },
  { value: "USD", label: "USD - United States Dollar" },
  { value: "UYU", label: "UYU - Uruguayan Peso" },
  { value: "UZS", label: "UZS - Uzbekistan Som" },
  { value: "VES", label: "VES - Venezuelan Bolívar Soberano" },
  { value: "VND", label: "VND - Vietnamese Dong" },
  { value: "VUV", label: "VUV - Vanuatu Vatu" },
  { value: "WST", label: "WST - Samoan Tala" },
  { value: "XAF", label: "XAF - CFA Franc BEAC" },
  { value: "XCD", label: "XCD - East Caribbean Dollar" },
  { value: "XOF", label: "XOF - CFA Franc BCEAO" },
  { value: "XPF", label: "XPF - CFP Franc" },
  { value: "YER", label: "YER - Yemeni Rial" },
  { value: "ZAR", label: "ZAR - South African Rand" },
  { value: "ZMW", label: "ZMW - Zambian Kwacha" },
  { value: "ZWL", label: "ZWL - Zimbabwean Dollar" },
].sort((a,b) => a.label.localeCompare(b.label));


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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "My Business Inc.",
      companyEmail: "contact@mybusiness.com",
      logo: "",
      defaultCurrency: "USD",
      dateFormat: "MM/DD/YYYY",
      timezone: "America/New_York",
    },
  });

  useEffect(() => {
    const initialLogoDataUri = form.getValues("logo");
    if (initialLogoDataUri && typeof initialLogoDataUri === 'string' && initialLogoDataUri.startsWith('data:image')) {
      setLogoPreview(initialLogoDataUri);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  function onSubmit(data: GeneralSettingsFormValues) {
    console.log(data);
    toast({
      title: "Settings Saved",
      description: "General settings have been updated successfully.",
    });
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        form.setValue("logo", result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
      form.setValue("logo", "", { shouldValidate: true });
    }
  };

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

                <FormField
                  control={form.control}
                  name="logo"
                  render={() => ( 
                    <FormItem>
                      <FormLabel>Company Logo</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus-visible:ring-primary"
                        />
                      </FormControl>
                      {logoPreview && (
                        <div className="mt-4">
                          <Image
                            src={logoPreview}
                            alt="Company Logo Preview"
                            width={100}
                            height={100}
                            className="rounded border object-contain"
                            data-ai-hint="company logo"
                          />
                        </div>
                      )}
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

