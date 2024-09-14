import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Mutation to generate an invite
export const createInvite = mutation({
  args: {
    group_id: v.id("groups"),
  },
  handler: async (ctx, { group_id }) => {
    const invited_by_user = await ctx.auth.getUserIdentity();
    if (!invited_by_user) throw new Error("Not authenticated");

    const invited_by_user_id = invited_by_user.subject.split("|")[0] as Id<"users">;

    // Check if the user is a member of the group
    const isGroupMember = await ctx.db
      .query("group_members")
      .filter((q) => q.eq(q.field("group_id"), group_id))
      .filter((q) => q.eq(q.field("user_id"), invited_by_user_id))
      .first();

    // If the user isn't a member, check if they're allowed to generate invites
    if (!isGroupMember) {
      // Add a condition for generating invites, such as if they are the group creator or have admin rights
      const group = await ctx.db.get(group_id);
      if (group.created_by !== invited_by_user_id) {
        throw new Error("User not authorized to create invites for this group");
      }
    }

    // Generate a token and store the invite
    const inviteToken = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const inviteId = await ctx.db.insert("group_invites", {
      group_id,
      invited_by: invited_by_user_id,
      invite_token: inviteToken,
      created_at: createdAt,
      expiry_date: expiryDate,
    });

    return { invite_token: inviteToken };
  },
});

// Query to validate invite token
export const validateInvite = query({
  args: { invite_token: v.string() },
  handler: async (ctx, { invite_token }) => {
    const invite = await ctx.db
      .query("group_invites")
      .filter((q) => q.eq(q.field("invite_token"), invite_token))
      .first();

    if (!invite) {
      throw new Error("Invalid invite.");
    }

    const now = new Date().toISOString();
    if (invite.expiry_date < now) {
      throw new Error("Invite expired.");
    }

    return invite;
  },
});
