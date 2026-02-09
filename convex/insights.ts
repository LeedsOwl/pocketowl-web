import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getInsights = query({
  args: {
    period: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .order("desc")
      .collect();

    const now = new Date();
    const startDate = new Date(now);
    switch (args.period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        throw new Error("Invalid period");
    }

    const filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.dateTime);
      return date >= startDate && date <= now;
    });

    const totalAmount = filteredTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );

    const categories = await ctx.db.query("categories").collect();
    const categoryById = new Map(categories.map((category) => [category._id, category]));

    const categoryTotalsByValue: Record<string, number> = {};
    for (const category of categories) {
      categoryTotalsByValue[category.value] = 0;
    }

    for (const transaction of filteredTransactions) {
      const categoryDoc = categoryById.get(transaction.category);
      const key = categoryDoc?.value ?? "others";
      categoryTotalsByValue[key] = (categoryTotalsByValue[key] ?? 0) + transaction.amount;
    }

    return {
      totalAmount,
      categoryTotals: categoryTotalsByValue,
    };
  },
});
