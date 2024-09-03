import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getUserInfo = query({
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not authenticated");
        }
        return await ctx.db.get(userId);
    }
})