
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, AlertTriangle } from "lucide-react";
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

const budgetFormSchema = z.object({
  category: z.string().min(1, "Category is required."),
  amount: z.coerce.number().positive("Budget amount must be a positive number."),
  month: z.string().min(1, "Month is required."), // Example: "2024-08"
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface Budget {
  id: string;
  category: string;
  categoryLabel: string;
  amount: number;
  spent: number;
  month: string; // Example: "2024-07"
}

// Mock data for expense categories
const expenseCategories = [
  { value: "office_supplies", label: "Office Supplies" },
  { value: "marketing", label: "Marketing" },
  { value: "utilities", label: "Utilities" },
  { value: "travel", label: "Travel" },
  { value: "software", label: "Software Subscriptions" },
  { value: "rent", label: "Rent/Lease" },
  { value: "other", label: "Other" },
];

// Mock data for budgets
const initialBudgets: Budget[] = [
  { id: "bud_1", category: "marketing", categoryLabel: "Marketing", amount: 500, spent: 250, month: "2024-07" },
  { id: "bud_2", category: "software", categoryLabel: "Software Subscriptions", amount: 200, spent: 180, month: "2024-07" },
  { id: "bud_3", category: "travel", categoryLabel: "Travel", amount: 300, spent: 400, month: "2024-07" },
  { id: "bud_4", category: "office_supplies", categoryLabel: "Office Supplies", amount: 150, spent: 70, month: "2024-07" },
];

const availableMonths = [
  { value: "2024-07", label: "July 2024" },
  { value: "2024-08", label: "August 2024" },
  { value: "2024-09", label: "September 2024" },
];


export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const { toast } = useToast();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      amount: 0,
      month: availableMonths[0].value, // Default to current/first available month
    },
  });
  
  React.useEffect(() => {
    if (editingBudget) {
      form.reset({
        category: editingBudget.category,
        amount: editingBudget.amount,
        month: editingBudget.month,
      });
    } else {
      form.reset({
        category: "",
        amount: 0,
        month: availableMonths[0].value,
      });
    }
  }, [editingBudget, form, isDialogOpen]);


  function onSubmit(data: BudgetFormValues) {
    const categoryLabel = expenseCategories.find(cat => cat.value === data.category)?.label || data.category;
    if (editingBudget) {
      setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...editingBudget, ...data, categoryLabel } : b));
      toast({ title: "Budget Updated", description: `Budget for ${categoryLabel} updated successfully.` });
    } else {
      const newBudget: Budget = {
        id: `bud_${Date.now()}`,
        ...data,
        categoryLabel,
        spent: 0, // New budgets start with 0 spent
      };
      setBudgets([...budgets, newBudget]);
      toast({ title: "Budget Created", description: `Budget for ${categoryLabel} created successfully.` });
    }
    setIsDialogOpen(false);
    setEditingBudget(null);
    form.reset();
  }

  const handleDeleteBudget = (budgetId: string) => {
    setBudgets(budgets.filter(b => b.id !== budgetId));
    toast({ title: "Budget Deleted", description: "Budget has been deleted.", variant: "destructive" });
  };

  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };
  
  const openNewDialog = () => {
    setEditingBudget(null);
    form.reset({ category: "", amount: 0, month: availableMonths[0].value }); // Ensure form is reset for new budget
    setIsDialogOpen(true);
  };


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Budgets</h1>
          <Button onClick={openNewDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Budget
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
            const isOverBudget = budget.spent > budget.amount;
            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{budget.categoryLabel}</CardTitle>
                      <CardDescription>
                        {availableMonths.find(m => m.value === budget.month)?.label || budget.month}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                       <Button variant="ghost" size="icon" onClick={() => openEditDialog(budget)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" onClick={() => handleDeleteBudget(budget.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="text-2xl font-bold">${budget.spent.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground"> / ${budget.amount.toFixed(2)} spent</span>
                  </div>
                  <Progress value={progress > 100 ? 100 : progress} className={isOverBudget ? '[&>div]:bg-destructive' : ''} />
                  {isOverBudget && (
                    <p className="text-xs text-destructive mt-2 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                    </p>
                  )}
                   {!isOverBudget && progress === 100 && (
                    <p className="text-xs text-green-600 mt-2">
                      Budget fully utilized.
                    </p>
                  )}
                  {!isOverBudget && budget.spent < budget.amount && (
                     <p className="text-xs text-muted-foreground mt-2">
                      ${(budget.amount - budget.spent).toFixed(2)} remaining.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No budgets created yet.</p>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Budget
            </Button>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Edit Budget" : "Create New Budget"}</DialogTitle>
              <DialogDescription>
                {editingBudget ? "Update the details for this budget." : "Set a new budget for a spending category."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                 <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableMonths.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {expenseCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingBudget ? "Save Changes" : "Create Budget"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
