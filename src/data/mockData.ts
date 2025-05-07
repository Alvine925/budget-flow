

export interface Client {
  id: string;
  value: string; // Usually same as id for select components
  label: string; // Name for display
  address?: string | null; // Allow null from DB
  email?: string | null; // Allow null from DB
  phone?: string | null; // Allow null from DB
  contactPerson?: string | null;
  category?: string | null;
  totalRevenue?: number | null;
  status?: "Active" | "Inactive" | "Lead" | null;
  avatarUrl?: string | null;
}

// This interface reflects the structure used in items/page.tsx form and state
export interface Item {
  id: string;
  name: string;
  sku?: string | null;
  type: "service" | "stock_item";
  description?: string | null;
  salePrice?: number | null;
  purchasePrice?: number | null;
  trackInventory?: boolean | null; // Allow null from DB if not explicitly set
  currentStock?: number | null;
  lowStockThreshold?: number | null;
}

// Removed initialClients array - data will come from Supabase
// export const initialClients: Client[] = [ ... ];

// Removed availableItems array - data will come from Supabase
// export const availableItems: Array<{ ... }> = [ ... ];


// Keep clientCategories here as well, as it's related to client data
export const clientCategories = ["Key Account", "Active Client", "New Lead", "Past Client", "Prospect"];

// Mock Company Data (Could also be moved to DB in future)
export const companyDetails = {
  name: "BudgetFlow Inc.",
  address: "99 Innovation Drive, Tech City, USA",
  email: "billing@budgetflow.com",
  phone: "555-FLOW",
  logoUrl: "https://picsum.photos/seed/budgetflow/100/40", // Placeholder logo
  aiHint: "company logo"
};

// Mock Tax Rate (Could also be moved to DB in future)
export const TAX_RATE = 0.1; // Example 10% tax rate
