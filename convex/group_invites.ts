import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getInvite = mutation({
  args: {
    group_id: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const { group_id } = args;

    const invited_by_user = await ctx.auth.getUserIdentity();
    const invited_by_user_id = invited_by_user?.subject.split(
      "|"
    )[0] as Id<"users">;

    // if user not member of group, return error
    const groupMember = await ctx.db
      .query("group_members")
      .filter(
        (q) =>
          q.eq(q.field("group_id"), group_id) &&
          q.eq(q.field("user_id"), invited_by_user_id)
      )
      .collect();

    if (groupMember.length === 0) {
      throw new Error("User not a member of this group");
    }

    //
    // if an invite already exists just return it
    const existingInvite = await ctx.db
      .query("group_invites")
      .filter(
        (q) =>
          q.eq(q.field("group_id"), group_id) &&
          q.eq(q.field("invited_by"), invited_by_user_id) &&
          q.gt(q.field("expiry_date"), new Date().toISOString())
      )
      .collect();

    if (existingInvite.length > 0) {
      return existingInvite[0];
    }

    // generate invite token
    const array = new Uint8Array(16); // Create an array of 16 bytes (128 bits)
    crypto.getRandomValues(array); // Fill the array with cryptographically secure random values

    const inviteToken = Array.from(array, (byte) =>
      ("0" + byte.toString(16)).slice(-2)
    ).join(""); // Convert bytes to hex string

    const createdAt = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now

    const invite = await ctx.db.insert("group_invites", {
      group_id,
      invited_by: invited_by_user_id,
      invite_token: inviteToken,
      created_at: createdAt,
      expiry_date: expiryDate,
    });

    return await ctx.db.get(invite);
  },
});
