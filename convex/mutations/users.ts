import { v } from "convex/values";
import { mutation } from "../_generated/server";

/**
 * Upsert a user by username.
 * If a user with the same username exists, update its data.
 * Otherwise, create a new user.
 */
export const upsertUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    username: v.string(),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    clerkId: v.string(), // Make required
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // First check by clerkId
    const existingByClerk = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingByClerk) {
      await ctx.db.patch(existingByClerk._id, {
        name: args.name ?? existingByClerk.name,
        image: args.image ?? existingByClerk.image,
        emailVerificationTime:
          args.emailVerificationTime ?? existingByClerk.emailVerificationTime,
        updatedAt: Date.now(),
      });
      return existingByClerk._id;
    }

    // Check username uniqueness
    const existingByUsername = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingByUsername) {
      throw new Error("Username already taken");
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      name: args.name ?? "",
      email: args.email ?? "",
      username: args.username,
      image: args.image ?? "",
      emailVerificationTime: args.emailVerificationTime ?? 0,
      clerkId: args.clerkId,
      role: "user",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newUserId;
  },
});
