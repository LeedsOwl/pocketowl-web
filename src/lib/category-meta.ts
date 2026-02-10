const CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  groceries: "Groceries",
  dining: "Dining Out",
  shopping: "Shopping",
  travel: "Travel",
  transportation: "Transportation",
  fuel: "Fuel",
  bills: "Bills",
  rent: "Rent",
  utilities: "Utilities",
  internet: "Internet",
  insurance: "Insurance",
  healthcare: "Healthcare",
  education: "Education",
  entertainment: "Entertainment",
  subscriptions: "Subscriptions",
  gifts: "Gifts",
  personal_care: "Personal Care",
  childcare: "Childcare",
  pets: "Pets",
  income: "Income",
  savings: "Savings",
  taxes: "Taxes",
  others: "Others",
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "#a9c1ae",
  groceries: "#97b592",
  dining: "#88a980",
  shopping: "#7a9d72",
  travel: "#6c9165",
  transportation: "#5d8558",
  fuel: "#507a4d",
  bills: "#466f46",
  rent: "#3f6542",
  utilities: "#385b3d",
  internet: "#315239",
  insurance: "#2a4934",
  healthcare: "#274533",
  education: "#22402f",
  entertainment: "#1f3b2b",
  subscriptions: "#1b3527",
  gifts: "#6f9c7e",
  personal_care: "#5f8f70",
  childcare: "#4e8261",
  pets: "#447457",
  income: "#9bc78f",
  savings: "#88b77d",
  taxes: "#577a5f",
  others: "#385041",
};

const FALLBACK_SAGE = [
  "#9ab39f",
  "#88a588",
  "#759775",
  "#648a67",
  "#527d58",
  "#466d4d",
];

export function normalizeCategoryKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function toTitleCase(value: string): string {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function fallbackColor(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_SAGE[hash % FALLBACK_SAGE.length];
}

export function getCategoryLabel(category: string): string {
  const key = normalizeCategoryKey(category);
  return CATEGORY_LABELS[key] || toTitleCase(key);
}

export function getCategoryColor(category: string): string {
  const key = normalizeCategoryKey(category);
  return CATEGORY_COLORS[key] || fallbackColor(key);
}
