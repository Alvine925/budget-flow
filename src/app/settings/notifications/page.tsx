
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import React from "react";

const notificationsSettingsSchema = z.object({
  emailNotificationsEnabled: z.boolean().default(true),
  emailInvoiceAlerts: z.boolean().default(true),
  emailBudgetAlerts: z.boolean().default(true),
  emailReportAlerts: z.boolean().default(false),

  inAppNotificationsEnabled: z.boolean().default(true),
  inAppInvoiceAlerts: z.boolean().default(true),
  inAppBudgetAlerts: z.boolean().default(true),
  inAppReportAlerts: z.boolean().default(true),
});

type NotificationsSettingsFormValues = z.infer<typeof notificationsSettingsSchema>;

export default function NotificationsSettingsPage() {
  const { toast } = useToast();

  const form = useForm<NotificationsSettingsFormValues>({
    resolver: zodResolver(notificationsSettingsSchema),
    // In a real app, load these from user preferences
    defaultValues: {
      emailNotificationsEnabled: true,
      emailInvoiceAlerts: true,
      emailBudgetAlerts: true,
      emailReportAlerts: false,
      inAppNotificationsEnabled: true,
      inAppInvoiceAlerts: true,
      inAppBudgetAlerts: true,
      inAppReportAlerts: true,
    },
  });

  const watchEmailEnabled = form.watch("emailNotificationsEnabled");
  const watchInAppEnabled = form.watch("inAppNotificationsEnabled");

  function onSubmit(data: NotificationsSettingsFormValues) {
    console.log("Notification settings submitted:", data);
    // In a real app, save these settings
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage notifications sent to your email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="emailNotificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Email Notifications</FormLabel>
                        <FormDescription>
                          Receive important updates and alerts via email.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchEmailEnabled && (
                  <div className="space-y-4 pl-4 border-l-2 ml-2">
                    <FormField
                      control={form.control}
                      name="emailInvoiceAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Invoice Alerts</FormLabel>
                            <FormDescription>Get notified for new invoices, payments, and overdue reminders.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailBudgetAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Budget Alerts</FormLabel>
                            <FormDescription>Receive alerts when approaching or exceeding budget limits.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="emailReportAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Report Notifications</FormLabel>
                            <FormDescription>Get notified when new reports or summaries are available.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>In-App Notifications</CardTitle>
                <CardDescription>Manage notifications you see within BudgetFlow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="inAppNotificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable In-App Notifications</FormLabel>
                        <FormDescription>
                          Receive updates and alerts directly within the application.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {watchInAppEnabled && (
                   <div className="space-y-4 pl-4 border-l-2 ml-2">
                    <FormField
                      control={form.control}
                      name="inAppInvoiceAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Invoice Alerts</FormLabel>
                            <FormDescription>Show in-app notifications for invoice activities.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inAppBudgetAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Budget Alerts</FormLabel>
                            <FormDescription>Show in-app notifications for budget status.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inAppReportAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Report Notifications</FormLabel>
                            <FormDescription>Show in-app notifications for new reports.</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
