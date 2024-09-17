import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";
import { api } from "../convex/_generated/api";

// Query to get user info
export const getUserInfo = query({
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new Error("Not authenticated");
        }
        return await ctx.db.get(userId);
    }
});

// Mutation to update the user's email
export const updateUserEmail = mutation({
    args: {
        userId: v.id("users"),
        email: v.string(),
    },
    handler: async (ctx, { userId, email }) => {
        if (!userId || !email) {
            throw new Error("Missing user ID or email");
        }

        // Update the user's email in the database
        await ctx.db.patch(userId, { email });

        return { success: true };
    },
});

// // Action to hash the password
// export const hashPassword = action(async (ctx, { password }: { password: string }) => {
//     const salt = await bcrypt.genSalt(10); // Generate salt
//     const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
//     return hashedPassword;
// });

export const comparePassword = action(async (ctx, { plainPassword, hashedPassword }) => {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid;
});

// Mutation to update the user's password (with old password verification)
export const updateUserPassword = action({
    args: {
        userId: v.id("users"),
        oldPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, { userId, oldPassword, newPassword }) => {
        if (!userId || !oldPassword || !newPassword) {
            throw new Error("Missing required fields.");
        }

        // Run the query to fetch the user using ctx.runQuery
        const user = await ctx.runQuery(api.users.getUserInfo, { userId });
        if (!user) {
            throw new Error("User not found.");
        }

        // Compare old password with the stored password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error("Old password is incorrect.");
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Run a mutation to update the user's password
        await ctx.runMutation(api.users.updatePasswordInDb, {
            userId,
            hashedPassword,
        });

        return { success: true };
    },
});

// Mutation to actually update the user's password in the database
export const updatePasswordInDb = mutation({
    args: {
        userId: v.id("users"),
        hashedPassword: v.string(),
    },
    handler: async (ctx, { userId, hashedPassword }) => {
        await ctx.db.patch(userId, { password: hashedPassword });
        return { success: true };
    },
});