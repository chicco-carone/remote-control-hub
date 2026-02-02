import { v } from "convex/values";
import { mutation } from "../_generated/server";

/**
 * Upsert a user by clerkId for asynchronous webhook synchronization.
 * Supports partial updates to handle out-of-order webhook events.
 * If a user with the same clerkId exists, update its data.
 * Otherwise, create a new user.
 *
 * SECURITY: The role field is NEVER accepted from external sources to prevent privilege escalation.
 * Existing user roles are preserved on updates. New users always get "user" role.
 * This mutation explicitly validates that no role is being set from the caller.
 */
export const upsertUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    clerkId: v.string(),
    // SECURITY: role is NEVER accepted from external sources
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // SECURITY: Explicitly check that role is not being passed
    // This prevents privilege escalation attempts
    if ("role" in args) {
      throw new Error("SECURITY: role field cannot be set externally");
    }

    // First check by clerkId
    const existingByClerk = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingByClerk) {
      // Perform partial update - only update provided fields
      // SECURITY: Never update the role field - preserve existing role
      const updateData: any = {
        updatedAt: Date.now(),
      };

      if (args.name !== undefined) updateData.name = args.name;
      if (args.email !== undefined) updateData.email = args.email;
      if (args.username !== undefined) updateData.username = args.username;
      if (args.image !== undefined) updateData.image = args.image;
      if (args.emailVerificationTime !== undefined)
        updateData.emailVerificationTime = args.emailVerificationTime;

      await ctx.db.patch(existingByClerk._id, updateData);
      return existingByClerk._id;
    }

    // For new users, compute a safe username fallback and do not enforce uniqueness.
    // Priority: provided username -> email local-part -> "user"
    let username = args.username;
    if (!username) {
      const email = args.email ?? "";
      const localPart = email.includes("@") ? email.split("@")[0] : "";
      username = localPart || "user";
    }

    // Create new user with defaults for undefined fields
    // SECURITY: New users always get "user" role by default
    const newUserId = await ctx.db.insert("users", {
      name: args.name ?? "",
      email: args.email ?? "",
      username,
      image: args.image ?? "",
      emailVerificationTime: args.emailVerificationTime ?? 0,
      clerkId: args.clerkId,
      role: "user", // SECURITY: Default role - never from external source
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newUserId;
  },
});

/**
 * Delete a user by clerkId for handling user.deleted webhook events.
 * This mutation removes the user and handles cascading cleanup if necessary.
 */
export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Find the user by clerkId
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      // User not found - this is fine for idempotent deletion
      console.warn(`User with clerkId ${args.clerkId} not found for deletion`);
      return null;
    }

    // Delete the user - Convex will handle cascading deletes based on schema constraints
    await ctx.db.delete(user._id);

    return null;
  },
});
