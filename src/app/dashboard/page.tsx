"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BarChart, CheckCircle2, DollarSign, FileText, LineChart, PieChart, Receipt, TrendingDown, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, Line, Pie, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from 'recharts';
import Link from "next/link";

const chartDataIncomeExpense = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
];

const chartDataCategorySpending = [
  { name: "Office Supplies", value: 400 },
  { name: "Marketing", value: 300 },
  { name: "Utilities", value: 300 },
  { name: "Travel", value: 200 },
  { name: "Software", value: 278 },
  { name: "Other", value: 189 },
];

const COLORS = ["#008080", "#F08080", "#2E8B57", "#FFD700", "#6A5ACD", "#A9A9A9"];


const budgetGoals = [
  { category: "Marketing", current: 250, goal: 500, progress: 50 },
  { category: "Software Subscriptions", current: 180, goal: 200, progress: 90 },
  { category: "Travel", current: 400, goal: 300, progress: 133 },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h1 className="text-3xl font-semibold mb-8 text-foreground">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$21,876.50</div>
              <p className="text-xs text-muted-foreground">-5.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$23,355.39</div>
              <p className="text-xs text-muted-foreground">+15.2% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">$5,670.00 overdue</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. Expenses</CardTitle>
              <CardDescription>Monthly overview of your financial flow.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                  income: { label: "Income", color: "hsl(var(--chart-1))" },
                  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
                }} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataIncomeExpense}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip content={<ChartTooltipContent />} />
                    <RechartsLegend content={<ChartLegendContent />} />
                    <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Breakdown of your expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartDataCategorySpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartDataCategorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                    <RechartsLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget Goals</CardTitle>
            <CardDescription>Track your progress towards your financial targets.</CardDescription>
          </CardHeader>
          <CardContent>
            {budgetGoals.map((goal) => (
              <div key={goal.category} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{goal.category}</span>
                  <span className={`text-sm font-semibold ${goal.current > goal.goal ? 'text-destructive' : 'text-primary'}`}>
                    ${goal.current.toFixed(2)} / ${goal.goal.toFixed(2)}
                  </span>
                </div>
                <Progress value={goal.progress > 100 ? 100 : goal.progress} className={goal.progress > 100 ? '[&>div]:bg-destructive' : ''} />
                {goal.current > goal.goal && (
                  <p className="text-xs text-destructive mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Over budget by ${(goal.current - goal.goal).toFixed(2)}
                  </p>
                )}
                 {goal.current <= goal.goal && goal.progress === 100 && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Goal achieved!
                  </p>
                )}
              </div>
            ))}
            <div className="mt-6 flex justify-end">
              <Link href="/budgets">
                <Button variant="outline">Manage Budgets</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/transactions/new?type=income">
                <Button className="w-full" variant="outline"><DollarSign className="mr-2 h-4 w-4" /> Add Income</Button>
              </Link>
              <Link href="/transactions/new?type=expense">
                <Button className="w-full" variant="outline"><TrendingDown className="mr-2 h-4 w-4" /> Add Expense</Button>
              </Link>
              <Link href="/invoices/new">
                <Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4" /> Create Invoice</Button>
              </Link>
               <Link href="/bills/new">
                <Button className="w-full" variant="outline"><Receipt className="mr-2 h-4 w-4" /> Add Bill</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between text-sm">
                  <span>Invoice #INV-0012 paid</span>
                  <span className="text-green-600">+$1,200.00</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span>Expense: Office Supplies</span>
                  <span className="text-destructive">-$45.50</span>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span>New Client: Acme Corp</span>
                  <span></span>
                </li>
                 <li className="flex items-center justify-between text-sm">
                  <span>Quotation #QT-005 accepted</span>
                  <span></span>
                </li>
              </ul>
              <div className="mt-4 flex justify-end">
                <Link href="/transactions">
                    <Button variant="link" className="text-primary">View all transactions</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
}
