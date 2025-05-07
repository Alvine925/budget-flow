
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getConversionRate, type Currencies, type ConversionRate } from "@/services/currency-converter";
import { ArrowRightLeft } from "lucide-react";

const currencyConverterSchema = z.object({
  fromCurrency: z.string().length(3, "Currency code must be 3 letters."),
  toCurrency: z.string().length(3, "Currency code must be 3 letters."),
  amount: z.coerce.number().positive("Amount must be positive."),
});

type CurrencyConverterFormValues = z.infer<typeof currencyConverterSchema>;

// Expanded list of available currencies
const availableCurrencies = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", 
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", 
  "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", 
  "COP", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", 
  "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GGP", "GHS", 
  "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HTG", "HUF", "IDR", 
  "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", 
  "KES", "KGS", "KHR", "KID", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", 
  "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", 
  "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", 
  "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", 
  "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", 
  "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD", 
  "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", 
  "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", 
  "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", 
  "ZWL"
].sort();


export default function CurrencySettingsPage() {
  const { toast } = useToast();
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CurrencyConverterFormValues>({
    resolver: zodResolver(currencyConverterSchema),
    defaultValues: {
      fromCurrency: "USD",
      toCurrency: "EUR",
      amount: 100,
    },
  });

  async function onSubmit(data: CurrencyConverterFormValues) {
    setIsLoading(true);
    setConversionResult(null);
    try {
      const currencies: Currencies = { from: data.fromCurrency, to: data.toCurrency };
      // Using a mock rate for now as getConversionRate is a mock
      const mockRate = Math.random() * 2 + 0.5; // Random rate between 0.5 and 2.5
      const conversionRate: ConversionRate = { rate: mockRate }; // await getConversionRate(currencies);
      
      const convertedAmount = data.amount * conversionRate.rate;
      setConversionResult(`${data.amount.toFixed(2)} ${data.fromCurrency} = ${convertedAmount.toFixed(2)} ${data.toCurrency} (Rate: ${conversionRate.rate.toFixed(4)})`);
      toast({
        title: "Conversion Successful (Mock)",
        description: `Converted ${data.amount} ${data.fromCurrency} to ${data.toCurrency}.`,
      });
    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion Failed",
        description: "Could not retrieve conversion rate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Currency Converter</CardTitle>
            <CardDescription>Quickly convert amounts between different currencies.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount to Convert</FormLabel>
                      <FormControl><Input type="number" placeholder="100.00" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="fromCurrency"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" 
                    onClick={() => {
                      const from = form.getValues("fromCurrency");
                      const to = form.getValues("toCurrency");
                      form.setValue("fromCurrency", to);
                      form.setValue("toCurrency", from);
                    }}
                    className="mb-2" // Align with input bottom
                    aria-label="Swap currencies">
                    <ArrowRightLeft className="h-5 w-5" />
                  </Button>
                  <FormField
                    control={form.control}
                    name="toCurrency"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableCurrencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Converting..." : "Convert (Mock Rate)"}
                </Button>

                {conversionResult && (
                  <Card className="mt-6 bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Conversion Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-semibold text-primary">{conversionResult}</p>
                    </CardContent>
                  </Card>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Placeholder for managing default currency and additional currencies */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
            <CardDescription>Manage default currency and enabled currencies for your business. (Feature coming soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This section will allow you to set a default currency for your business operations and manage a list of other currencies you frequently work with, including setting manual exchange rates if needed.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

