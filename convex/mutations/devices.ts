import { v } from "convex/values";
import { deviceSchema } from "../../types/validation";
import { mutation } from "../_generated/server";

export const createDevice = mutation({
  args: {
    name: v.string(),
    manufacturer: v.string(),
    model: v.optional(v.string()),
    deviceType: v.string(),
    notes: v.optional(v.string()),
    codes: v.array(
      v.object({
        name: v.string(),
        code: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const result = deviceSchema.safeParse(args);
    if (!result.success) {
      throw new Error(result.error.issues.map((e) => e.message).join(", "));
    }
    const validatedArgs = result.data;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found. Please sign in with Clerk.");
    }

    const deviceId = await ctx.db.insert("devices", {
      name: validatedArgs.name,
      manufacturer: validatedArgs.manufacturer,
      model: validatedArgs.model,
      deviceType: validatedArgs.deviceType,
      notes: validatedArgs.notes,
      authorId: user._id,
      uploadedAt: new Date().toISOString(),
      totalVotes: {
        thumbsUp: 0,
        thumbsDown: 0,
      },
    });

    const codeIds = await Promise.all(
      validatedArgs.codes.map(async (code: { name: string; code: string }) => {
        return await ctx.db.insert("codes", {
          deviceId,
          name: code.name,
          code: code.code,
          authorId: user._id,
          uploadedAt: new Date().toISOString(),
          votes: {
            thumbsUp: 0,
            thumbsDown: 0,
          },
        });
      }),
    );

    return {
      deviceId,
      codeIds,
      message: "Device added successfully!",
    };
  },
});

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const deleteDevice = mutation({
  args: {
    deviceId: v.id("devices"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated to delete device");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const device = await ctx.db.get(args.deviceId);
    if (!device) {
      throw new Error("Device not found");
    }

    const isAdmin = (user.role as string | undefined) === "admin";
    const isOwner = device.authorId === user._id;
    if (!isOwner && !isAdmin) {
      throw new Error("Only the author or an admin can delete this device");
    }

    // Gather codes and votes (both device-level and code-level) for snapshot
    const codes = await ctx.db
      .query("codes")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    // All votes belonging to this device (including device-level votes where codeId is undefined)
    const allDeviceVotes = await ctx.db
      .query("votes")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    const now = new Date();
    const purgeAt = addDays(now, 15).toISOString();

    // Insert snapshot into deleted_devices
    await ctx.db.insert("deleted_devices", {
      deviceId: device._id,
      device,
      codes,
      votes: allDeviceVotes,
      deletedBy: user._id,
      deletedAt: now.toISOString(),
      purgeAt,
    });

    // Hard delete votes, then codes, then device
    for (const vote of allDeviceVotes) {
      await ctx.db.delete(vote._id);
    }

    for (const code of codes) {
      await ctx.db.delete(code._id);
    }

    await ctx.db.delete(args.deviceId);

    return { message: "Device deleted (soft) successfully!" };
  },
});
