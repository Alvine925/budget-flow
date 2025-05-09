

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

export const initialClients: Client[] = [
  { id: "client_1", value: "client_1", label: "Acme Corp", email: "contact@acme.com", phone: "555-0101", address: "123 Acme St, Techville", category: "Key Account", totalRevenue: 50000, status: "Active", avatarUrl: "https://picsum.photos/seed/acme/40/40", contactPerson: "John Doe" },
  { id: "client_2", value: "client_2", label: "Beta Solutions", email: "info@betasolutions.com", phone: "555-0102", address: "456 Beta Ave, Innovate City", category: "Active Client", totalRevenue: 25000, status: "Active", avatarUrl: "https://picsum.photos/seed/beta/40/40", contactPerson: "Jane Smith" },
  { id: "client_3", value: "client_3", label: "Gamma Inc.", email: "support@gammainc.io", phone: "555-0103", address: "789 Gamma Rd, Ventureburg", category: "New Lead", totalRevenue: 0, status: "Lead", avatarUrl: "https://picsum.photos/seed/gamma/40/40", contactPerson: "Robert Brown" },
  { id: "client_4", value: "client_4", label: "Delta LLC", email: "sales@deltallc.org", phone: "555-0104", address: "101 Delta Blvd, Uniontown", category: "Past Client", totalRevenue: 10000, status: "Inactive", avatarUrl: "https://picsum.photos/seed/delta/40/40", contactPerson: "Emily White" },
  { id: "client_5", value: "client_5", label: "Epsilon Ltd.", email: "connect@epsilon.ltd", phone: "555-0105", address: "202 Epsilon Sq, Metrocity", category: "Prospect", totalRevenue: 0, status: "Lead", avatarUrl: "https://picsum.photos/seed/epsilon/40/40", contactPerson: "Michael Green" },
];

export const initialItems: Item[] = [
  { id: "item_1", name: "Web Design Package", sku: "SERV-WD-001", type: "service", description: "Complete website design and development.", salePrice: 2500, purchasePrice: null, trackInventory: false },
  { id: "item_2", name: "Premium Laptop Model X", sku: "HW-LAP-00X", type: "stock_item", description: "High-performance laptop.", salePrice: 1200, purchasePrice: 800, trackInventory: true, currentStock: 15, lowStockThreshold: 5 },
  { id: "item_3", name: "Consulting Hour", sku: "SERV-CON-001", type: "service", description: "One hour of expert consultation.", salePrice: 150, purchasePrice: null, trackInventory: false },
  { id: "item_4", name: "Wireless Mouse Z", sku: "HW-MOU-00Z", type: "stock_item", description: "Ergonomic wireless mouse.", salePrice: 45, purchasePrice: 20, trackInventory: true, currentStock: 50, lowStockThreshold: 10 },
  { id: "item_5", name: "Monthly Support Plan", sku: "SERV-SUP-M", type: "service", description: "Monthly technical support subscription.", salePrice: 99, purchasePrice: null, trackInventory: false },
  { id: "item_6", name: "Office Chair Pro", sku: "FURN-CHR-PRO", type: "stock_item", description: "Ergonomic office chair.", salePrice: 250, purchasePrice: 150, trackInventory: true, currentStock: 8, lowStockThreshold: 3 },
];


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
