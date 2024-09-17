import { query } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserSettings = query(async ({ db }, { userId }) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    return await db
        .query("user_settings")
        .withIndex("by_user_id", (q) => q.eq("user_id", userId))
        .first();
});

export const updateUserSettings = mutation({
    args: {
        userId: v.id("users"),
        currency: v.string(),
    },
    handler: async (ctx, { userId, currency }) => {
        if (!userId || !currency) {
            throw new Error("Missing user ID or currency");
        }

        // Update user settings in the database
        await ctx.db.patch(userId, { currency });

        return { success: true };
    },
});