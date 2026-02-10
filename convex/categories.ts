import { mutation, query } from "./_generated/server";

const DEFAULT_CATEGORIES = [
  { value: "food", friendly_name: "Food" },
  { value: "groceries", friendly_name: "Groceries" },
  { value: "dining", friendly_name: "Dining Out" },
  { value: "shopping", friendly_name: "Shopping" },
  { value: "travel", friendly_name: "Travel" },
  { value: "transportation", friendly_name: "Transportation" },
  { value: "fuel", friendly_name: "Fuel" },
  { value: "bills", friendly_name: "Bills" },
  { value: "rent", friendly_name: "Rent" },
  { value: "utilities", friendly_name: "Utilities" },
  { value: "internet", friendly_name: "Internet" },
  { value: "insurance", friendly_name: "Insurance" },
  { value: "healthcare", friendly_name: "Healthcare" },
  { value: "education", friendly_name: "Education" },
  { value: "entertainment", friendly_name: "Entertainment" },
  { value: "subscriptions", friendly_name: "Subscriptions" },
  { value: "gifts", friendly_name: "Gifts" },
  { value: "personal_care", friendly_name: "Personal Care" },
  { value: "childcare", friendly_name: "Childcare" },
  { value: "pets", friendly_name: "Pets" },
  { value: "income", friendly_name: "Income" },
  { value: "savings", friendly_name: "Savings" },
  { value: "taxes", friendly_name: "Taxes" },
  { value: "others", friendly_name: "Others" },
] as const;

export const getCategories = query({
    handler: async (ctx, args) => {
        const categories = await ctx.db.query("categories").collect();
        return categories.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name));
    }
});

export const ensureDefaultCategories = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").collect();
    const existingValues = new Set(existing.map((category) => category.value));

    let created = 0;
    for (const category of DEFAULT_CATEGORIES) {
      if (!existingValues.has(category.value)) {
        await ctx.db.insert("categories", {
          value: category.value,
          friendly_name: category.friendly_name,
        });
        created += 1;
      }
    }

    return { created };
  },
});
