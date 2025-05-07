
export interface Client {
  id: string;
  value: string; // Usually same as id for select components
  label: string; // Name for display
  address: string;
  email: string;
  // Add other fields needed by clients page like contactPerson, category, totalRevenue, status
  contactPerson?: string;
  category?: string;
  totalRevenue?: number;
  status?: "Active" | "Inactive" | "Lead";
  avatarUrl?: string;
}

export interface Item {
  value: string; // Usually an ID like "item_1"
  label: string; // Name for display
  price: number;
  // Add other fields needed by items page like sku, type, description, purchasePrice etc.
  id?: string;
  sku?: string;
  type?: "service" | "stock_item";
  description?: string;
  purchasePrice?: number;
  trackInventory?: boolean;
  currentStock?: number;
  lowStockThreshold?: number;
}


export const initialClients: Client[] = [
  { id: "client_1", value: "client_1", label: "Acme Corp", contactPerson: "John Doe", email: "john.doe@acme.com", phone: "555-0101", address: "123 Main St, Anytown USA", category: "Key Account", totalRevenue: 25000, status: "Active", avatarUrl: "https://picsum.photos/seed/acme/40/40" },
  { id: "client_2", value: "client_2", label: "Beta Solutions", contactPerson: "Jane Smith", email: "jane.smith@beta.io", phone: "555-0102", address: "456 Oak Ave, Anytown USA", category: "New Lead", totalRevenue: 0, status: "Lead", avatarUrl: "https://picsum.photos/seed/beta/40/40" },
  { id: "client_3", value: "client_3", label: "Gamma Inc.", contactPerson: "Robert Brown", email: "robert.b@gamma.co", phone: "555-0103", address: "789 Pine Ln, Sometown USA", category: "Past Client", totalRevenue: 5000, status: "Inactive" },
  { id: "client_4", value: "client_4", label: "Delta LLC", contactPerson: "Alice Green", email: "alice.g@delta.org", phone: "555-0104", address: "101 Delta Way, Anytown USA", category: "Active Client", totalRevenue: 12000, status: "Active", avatarUrl: "https://picsum.photos/seed/delta/40/40" },
];


export const availableItems: Item[] = [
  { id: "item_1", value: "item_1", label: "Web Design Service", price: 1200, type: "service" },
  { id: "item_2", value: "item_2", label: "Consulting Hours", price: 150, type: "service" },
  { id: "item_3", value: "item_3", label: "Software License", price: 500, type: "service" }, // Assuming service for simplicity
  { id: "item_4", value: "item_4", label: "Custom Development", price: 80, type: "service" }, // Assuming service for simplicity
  // Example stock item if needed for testing items page linkage
  { id: "item_5", value: "item_5", label: "Wireless Mouse Z", price: 45, sku: "HW-MOU-00Z", type: "stock_item", purchasePrice: 20, trackInventory: true, currentStock: 50, lowStockThreshold: 10 },
];

// Keep clientCategories here as well, as it's related to client data
export const clientCategories = ["Key Account", "Active Client", "New Lead", "Past Client", "Prospect"];

// Mock Company Data
export const companyDetails = {
  name: "BudgetFlow Inc.",
  address: "99 Innovation Drive, Tech City, USA",
  email: "billing@budgetflow.com",
  phone: "555-FLOW",
  logoUrl: "https://picsum.photos/seed/budgetflow/100/40", // Placeholder logo
  aiHint: "company logo"
};

// Mock Tax Rate
export const TAX_RATE = 0.1; // Example 10% tax rate
