
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Package, DollarSign, AlertTriangle, Archive } from "lucide-react";
import { DatePickerWithRange } from "@/components/date-range-picker";
import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const inventorySummaryData = [
  { name: "Premium Laptop Model X", category: "Electronics", stock: 15, value: 15 * 800, lowStockThreshold: 5 },
  { name: "Wireless Mouse Z", category: "Accessories", stock: 50, value: 50 * 20, lowStockThreshold: 10 },
  { name: "Office Chair Pro", category: "Furniture", stock: 8, value: 8 * 150, lowStockThreshold: 3 },
  { name: "Printer Ink Cartridge", category: "Supplies", stock: 2, value: 2 * 15, lowStockThreshold: 5 },
  { name: "Software License A", category: "Software", stock: 100, value: 100 * 50, lowStockThreshold: 20 }, // Example non-physical
];

const totalInventoryValue = inventorySummaryData.reduce((sum, item) => sum + item.value, 0);
const totalItemsInStock = inventorySummaryData.reduce((sum, item) => sum + item.stock, 0);
const itemsLowStock = inventorySummaryData.filter(item => item.stock <= item.lowStockThreshold && item.stock > 0).length;
const itemsOutOfStock = inventorySummaryData.filter(item => item.stock === 0).length;

const summaryMetrics = {
  totalValue: totalInventoryValue,
  totalItems: totalItemsInStock,
  lowStockCount: itemsLowStock,
  outOfStockCount: itemsOutOfStock,
};

const stockValueByCategory = inventorySummaryData.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + item.value;
  return acc;
}, {} as Record<string, number>);

const stockValueByCategoryChartData = Object.entries(stockValueByCategory).map(([name, value]) => ({ name, value }));

export default function InventorySummaryPage() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-semibold text-foreground">Inventory Summary Report</h1>
          <div className="flex items-center gap-2">
            <DatePickerWithRange />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export (PDF)
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summaryMetrics.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current valuation of all stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.totalItems.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sum of all item quantities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.lowStockCount}</div>
              <p className="text-xs text-muted-foreground">Items at or below threshold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryMetrics.outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">Items with zero quantity</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Inventory Value by Category</CardTitle>
                <CardDescription>Distribution of inventory value across different categories.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ value: { label: "Value", color: "hsl(var(--chart-1))" } }} className="h-[350px] w-full">
                    <RechartsBarChart data={stockValueByCategoryChartData} layout="vertical" margin={{ right: 30, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `$${value/1000}k`} />
                        <YAxis dataKey="name" type="category" width={120} />
                        <RechartsTooltip content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />} />
                        <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Inventory List</CardTitle>
            <CardDescription>Overview of each item's stock level and value.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Low Stock Threshold</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventorySummaryData.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">{item.stock.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.lowStockThreshold.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.value.toLocaleString()}</TableCell>
                    <TableCell>
                      {item.stock === 0 ? <span className="text-red-600 font-semibold">Out of Stock</span> :
                       item.stock <= item.lowStockThreshold ? <span className="text-yellow-600 font-semibold">Low Stock</span> :
                       <span className="text-green-600">In Stock</span>}
                    </TableCell>
                  </TableRow>
                ))}
                {inventorySummaryData.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No inventory data available.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

