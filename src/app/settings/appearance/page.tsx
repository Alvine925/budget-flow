
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";

const appearanceSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"], { required_error: "Theme selection is required." }),
  accentColor: z.string().min(1, "Accent color is required."),
});

type AppearanceSettingsFormValues = z.infer<typeof appearanceSettingsSchema>;

const accentColors = [
  { value: "teal", label: "Teal (Default)" },
  { value: "coral", label: "Soft Coral" },
  { value: "blue", label: "Medium Blue" },
  { value: "yellow", label: "Soft Yellow" },
  { value: "purple", label: "Soft Purple" },
];

export default function AppearanceSettingsPage() {
  const { toast } = useToast();
  // const [effectiveTheme, setEffectiveTheme] = React.useState("system");

  const form = useForm<AppearanceSettingsFormValues>({
    resolver: zodResolver(appearanceSettingsSchema),
    defaultValues: {
      theme: "system", // In a real app, load from localStorage or user preferences
      accentColor: "teal",
    },
  });

  const currentTheme = form.watch("theme");

  useEffect(() => {
    const applyTheme = (themeValue: string) => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (themeValue === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
        // setEffectiveTheme(systemTheme);
      } else {
        root.classList.add(themeValue);
        // setEffectiveTheme(themeValue);
      }
    };
    applyTheme(currentTheme);
  }, [currentTheme]);


  function onSubmit(data: AppearanceSettingsFormValues) {
    console.log("Appearance settings submitted:", data);
    // In a real app, save these settings (e.g., to localStorage or backend)
    // localStorage.setItem("appTheme", data.theme);
    // localStorage.setItem("appAccentColor", data.accentColor);
    
    // Applying theme is handled by useEffect. For accent color, it would require CSS variable changes.
    // This is a mock for now.
    toast({
      title: "Appearance Settings Saved",
      description: "Your theme and accent color preferences have been updated.",
    });
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>Customize the look and feel of BudgetFlow.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="light" /></FormControl>
                            <FormLabel className="font-normal">Light</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="dark" /></FormControl>
                            <FormLabel className="font-normal">Dark</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="system" /></FormControl>
                            <FormLabel className="font-normal">System</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color (Mock)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an accent color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accentColors.map(color => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <span 
                                  className="h-4 w-4 rounded-full" 
                                  style={{ backgroundColor: 
                                    color.value === 'teal' ? 'hsl(180 100% 25.1%)' :
                                    color.value === 'coral' ? 'hsl(0 80% 75.3%)' :
                                    color.value === 'blue' ? 'hsl(210 70% 60%)' :
                                    color.value === 'yellow' ? 'hsl(45 80% 65%)' :
                                    color.value === 'purple' ? 'hsl(300 60% 70%)' : 'transparent'
                                  }}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Note: Accent color change is a visual mock and doesn't fully re-theme the app from here.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
