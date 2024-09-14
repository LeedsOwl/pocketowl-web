import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";


export const setUserFinancialData = mutation({
    args: {
        account_balance: v.number(),
        income: v.number(),
        income_type: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Insert or update the user financial data
        const existingRecord = await ctx.db
            .query("user_financial_data")
            .filter((q) => q.eq(q.field("user_id"), userId))
            .first();

        if (existingRecord) {
            await ctx.db.patch(existingRecord._id, {
                account_balance: args.account_balance,
                income: args.income,
                income_type: args.income_type,
            });
        } else {
            await ctx.db.insert("user_financial_data", {
                user_id: userId,
                account_balance: args.account_balance,
                income: args.income,
                income_type: args.income_type,
            });
        }
    },
});


export const getUserFinancialData = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        return await ctx.db.query("user_financial_data").filter((q) => q.eq(q.field("user_id"), userId)).first();
    },
});