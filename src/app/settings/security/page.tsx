
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { ShieldCheck, Smartphone, Laptop, Tablet } from "lucide-react";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
  confirmNewPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

const mockSessions = [
  { id: "session_1", device: "Chrome on Windows", type: "Laptop" as const, location: "New York, USA", lastActive: "Current session" },
  { id: "session_2", device: "Safari on iPhone", type: "Smartphone" as const, location: "London, UK", lastActive: "2 days ago" },
  { id: "session_3", device: "Firefox on MacOS", type: "Laptop" as const, location: "Paris, France", lastActive: "1 week ago" },
];

const DeviceIcon = ({ type }: { type: "Laptop" | "Smartphone" | "Tablet" }) => {
  if (type === "Laptop") return <Laptop className="h-5 w-5 text-muted-foreground" />;
  if (type === "Smartphone") return <Smartphone className="h-5 w-5 text-muted-foreground" />;
  if (type === "Tablet") return <Tablet className="h-5 w-5 text-muted-foreground" />;
  return null;
};

export default function SecuritySettingsPage() {
  const { toast } = useToast();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false); // Mock state
  const [activeSessions, setActiveSessions] = useState(mockSessions);

  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function onPasswordChangeSubmit(data: PasswordChangeFormValues) {
    console.log("Password change data:", data);
    // In a real app, call an API to change password
    toast({
      title: "Password Changed (Mock)",
      description: "Your password has been successfully updated.",
    });
    passwordForm.reset();
  }

  const toggleTwoFactor = () => {
    setIsTwoFactorEnabled(!isTwoFactorEnabled);
    toast({
      title: `Two-Factor Authentication ${!isTwoFactorEnabled ? "Enabled" : "Disabled"} (Mock)`,
      description: `2FA has been ${!isTwoFactorEnabled ? "activated" : "deactivated"}.`,
    });
  };

  const signOutAllSessions = () => {
    setActiveSessions(activeSessions.filter(session => session.lastActive === "Current session"));
     toast({
      title: "Signed Out (Mock)",
      description: "You have been signed out of all other active sessions.",
    });
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-3xl space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
            </div>
            <CardDescription>Add an extra layer of security to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {isTwoFactorEnabled 
                ? "Two-Factor Authentication is currently enabled for your account." 
                : "Protect your account from unauthorized access by enabling 2FA."}
            </p>
            <Button onClick={toggleTwoFactor}>
              {isTwoFactorEnabled ? "Disable 2FA (Mock)" : "Enable 2FA (Mock)"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password regularly for better security.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordChangeSubmit)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Change Password (Mock)</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage devices currently logged into your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSessions.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          <DeviceIcon type={session.type} />
                          {session.device}
                        </TableCell>
                        <TableCell>{session.location}</TableCell>
                        <TableCell>{session.lastActive}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {activeSessions.length > 1 && (
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={signOutAllSessions}>Sign Out All Other Sessions (Mock)</Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No active sessions found (or you've signed out of all).</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
