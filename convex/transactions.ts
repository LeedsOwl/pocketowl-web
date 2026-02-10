import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setTransaction = mutation({
  args: {
    user_id: v.id("users"),
    dateTime: v.string(),
    description: v.string(),
    amount: v.number(),
    category: v.id("categories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", args);
  },
});

export const getUserTransactions = query({
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

    const categories = await ctx.db.query("categories").collect();
    const categoryById = new Map(categories.map((category) => [category._id, category]));

    return transactions.map((transaction) => {
      const categoryDoc = categoryById.get(transaction.category);
      return {
        ...transaction,
        category: categoryDoc?.value ?? "others",
        categoryFriendlyName: categoryDoc?.friendly_name ?? "Others",
      };
    });
  },
});

export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    description: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      description: args.description,
      amount: args.amount,
    });
  },
});

export const deleteTransaction = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
