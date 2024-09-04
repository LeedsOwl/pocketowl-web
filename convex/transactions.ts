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
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .order("desc")
      .collect();
  },
});
