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

    let filteredTransactions = [];
    switch (args.period) {
      case "week":
        filteredTransactions = transactions.filter((t) => {
          const date = new Date(t.dateTime);
          const now = new Date();
          return date > new Date(now.setDate(now.getDate() - 7));
        });
        break;
      case "month":
        filteredTransactions = transactions.filter((t) => {
          const date = new Date(t.dateTime);
          const now = new Date();
          return date.getMonth() === now.getMonth();
        });
        break;
      case "year":
        filteredTransactions = transactions.filter((t) => {
          const date = new Date(t.dateTime);
          const now = new Date();
          return date.getFullYear() === now.getFullYear();
        });
        break;
      default:
        throw new Error("Invalid period");
    }

    // get total amount spent in period
    const totalAmount = filteredTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );

    // get total amount spent per category
    const categories = await ctx.db.query("categories").collect();
    const categoryTotals = categories.reduce(
      (acc: { [key: string]: number }, category) => {
        const categoryTransactions = filteredTransactions.filter(
          (t) => t.category === category._id
        );
        const total = categoryTransactions.reduce(
          (acc, t) => acc + t.amount,
          0
        );
        acc[category.value] = total;
        return acc;
      },
      {}
    );

    return {
      totalAmount,
      categoryTotals,
    };
  },
});
