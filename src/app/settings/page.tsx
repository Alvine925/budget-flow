
"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Calculator, Coins, UserCog, Palette, ShieldCheck, Bell } from "lucide-react";
import Link from "next/link";

const settingsSections = [
  { title: "General Settings", description: "Manage company profile, localization, and basic preferences.", icon: Settings, href: "/settings/general" },
  { title: "Tax Settings", description: "Configure tax rates, regions, and calculation methods.", icon: Calculator, href: "/settings/tax" },
  { title: "Currency Converter", description: "Set up default and additional currencies, manage exchange rates.", icon: Coins, href: "/settings/currency" },
  { title: "User Management", description: "Manage users, roles, and permissions within the application.", icon: UserCog, href: "/settings/users" },
  { title: "Appearance", description: "Customize the look and feel of BudgetFlow.", icon: Palette, href: "/settings/appearance" },
  { title: "Security", description: "Manage your account security, 2FA, and active sessions.", icon: ShieldCheck, href: "/settings/security" },
  { title: "Notifications", description: "Configure your email and in-app notification preferences.", icon: Bell, href: "/settings/notifications" },
];

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-semibold mb-8 text-foreground">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => (
            <Card key={section.title} className={`flex flex-col ${section.comingSoon ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <section.icon className="h-7 w-7 text-primary" />
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {section.comingSoon ? (
                  <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
                ) : (
                  <Link href={section.href} legacyBehavior>
                    <Button variant="outline" className="w-full">
                      Manage {section.title.split(" ")[0]}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
