import { v } from "convex/values";
import { mutation } from "../_generated/server";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const deleteCode = mutation({
  args: {
    codeId: v.id("codes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated to delete code");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const code = await ctx.db.get(args.codeId);
    if (!code) {
      throw new Error("Code not found");
    }

    const device = await ctx.db.get(code.deviceId);
    if (!device) {
      throw new Error("Parent device not found");
    }

    const isAdmin = (user.role as string | undefined) === "admin";
    const isOwner = device.authorId === user._id;
    if (!isOwner && !isAdmin) {
      throw new Error("Only the device author or an admin can delete this code");
    }

    // Collect votes for this code (snapshot + for recalculation later)
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_code", (q) => q.eq("codeId", code._id))
      .collect();

    const now = new Date();
    const purgeAt = addDays(now, 15).toISOString();

    // Store snapshot in deleted_codes
    await ctx.db.insert("deleted_codes", {
      codeId: code._id,
      deviceId: code.deviceId,
      code,
      votes,
      deletedBy: user._id,
      deletedAt: now.toISOString(),
      purgeAt,
    });

    // Hard delete votes then the code
    for (const vtx of votes) {
      await ctx.db.delete(vtx._id);
    }

    await ctx.db.delete(code._id);

    // Recalculate device totalVotes based on remaining votes of the device
    const remainingDeviceVotes = await ctx.db
      .query("votes")
      .withIndex("by_device", (q) => q.eq("deviceId", device._id))
      .collect();

    const deviceThumbsUp = remainingDeviceVotes.filter((v) => v.type === "up").length;
    const deviceThumbsDown = remainingDeviceVotes.filter((v) => v.type === "down").length;

    await ctx.db.patch(device._id, {
      totalVotes: {
        thumbsUp: deviceThumbsUp,
        thumbsDown: deviceThumbsDown,
      },
    });

    return { message: "Code deleted (soft) successfully" };
  },
});
