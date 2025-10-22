import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const voteOnCode = mutation({
  args: {
    codeId: v.id("codes"),
    deviceId: v.id("devices"),
    type: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated to vote");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const code = await ctx.db.get(args.codeId);
    const device = await ctx.db.get(args.deviceId);

    if (!code || !device) {
      throw new Error("Code or device not found");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_code", (q) =>
        q.eq("userId", user._id).eq("codeId", args.codeId),
      )
      .first();

    let newVote: "up" | "down" | null = args.type;

    if (existingVote) {
      if (existingVote.type === args.type) {
        await ctx.db.delete(existingVote._id);
        newVote = null;
      } else {
        await ctx.db.patch(existingVote._id, {
          type: args.type,
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      await ctx.db.insert("votes", {
        userId: user._id,
        codeId: args.codeId,
        deviceId: args.deviceId,
        type: args.type,
        createdAt: new Date().toISOString(),
      });
    }

    const allVotes = await ctx.db
      .query("votes")
      .withIndex("by_code", (q) => q.eq("codeId", args.codeId))
      .collect();

    const thumbsUp = allVotes.filter((v) => v.type === "up").length;
    const thumbsDown = allVotes.filter((v) => v.type === "down").length;

    await ctx.db.patch(args.codeId, {
      votes: { thumbsUp, thumbsDown },
    });

    const allDeviceVotes = await ctx.db
      .query("votes")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    const deviceThumbsUp = allDeviceVotes.filter((v) => v.type === "up").length;
    const deviceThumbsDown = allDeviceVotes.filter(
      (v) => v.type === "down",
    ).length;

    await ctx.db.patch(args.deviceId, {
      totalVotes: {
        thumbsUp: deviceThumbsUp,
        thumbsDown: deviceThumbsDown,
      },
    });

    const updatedCode = await ctx.db.get(args.codeId);
    const updatedDevice = await ctx.db.get(args.deviceId);

    return {
      code: updatedCode,
      device: updatedDevice,
      userVote: newVote,
      message: "Vote recorded successfully!",
    };
  },
});

export const voteOnAllCodes = mutation({
  args: {
    deviceId: v.id("devices"),
    type: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated to vote");
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

    // Get all codes for the device
    const codes = await ctx.db
      .query("codes")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    if (codes.length === 0) {
      throw new Error("No codes found for this device");
    }

    // Process each code
    const updatedCodes = [];
    for (const code of codes) {
      const existingVote = await ctx.db
        .query("votes")
        .withIndex("by_user_code", (q) =>
          q.eq("userId", user._id).eq("codeId", code._id),
        )
        .first();

      let newVote: "up" | "down" | null = args.type;

      if (existingVote) {
        if (existingVote.type === args.type) {
          await ctx.db.delete(existingVote._id);
          newVote = null;
        } else {
          await ctx.db.patch(existingVote._id, {
            type: args.type,
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        await ctx.db.insert("votes", {
          userId: user._id,
          codeId: code._id,
          deviceId: args.deviceId,
          type: args.type,
          createdAt: new Date().toISOString(),
        });
      }

      // Recalculate votes for this specific code
      const allCodeVotes = await ctx.db
        .query("votes")
        .withIndex("by_code", (q) => q.eq("codeId", code._id))
        .collect();

      const thumbsUp = allCodeVotes.filter((v) => v.type === "up").length;
      const thumbsDown = allCodeVotes.filter((v) => v.type === "down").length;

      await ctx.db.patch(code._id, {
        votes: { thumbsUp, thumbsDown },
      });

      updatedCodes.push({
        id: code._id,
        name: code.name,
        code: code.code,
        uploadedBy: code.authorId,
        uploadedByImage: "",
        uploadedAt: code.uploadedAt,
        votes: { thumbsUp, thumbsDown },
        userVote: newVote,
      });
    }

    // Recalculate overall device votes
    const allDeviceVotes = await ctx.db
      .query("votes")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    const deviceThumbsUp = allDeviceVotes.filter((v) => v.type === "up").length;
    const deviceThumbsDown = allDeviceVotes.filter(
      (v) => v.type === "down",
    ).length;

    await ctx.db.patch(args.deviceId, {
      totalVotes: {
        thumbsUp: deviceThumbsUp,
        thumbsDown: deviceThumbsDown,
      },
    });

    const updatedDevice = await ctx.db.get(args.deviceId);

    return {
      codes: updatedCodes,
      device: updatedDevice,
      message: `Successfully voted ${args.type} on all codes`,
    };
  },
});

export const voteOnDevice = mutation({
  args: {
    deviceId: v.id("devices"),
    type: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be authenticated to vote");
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

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_device", (q) =>
        q.eq("userId", user._id).eq("deviceId", args.deviceId),
      )
      .filter((q) => q.eq(q.field("codeId"), undefined))
      .first();

    let newVote: "up" | "down" | null = args.type;

    if (existingVote) {
      if (existingVote.type === args.type) {
        await ctx.db.delete(existingVote._id);
        newVote = null;
      } else {
        await ctx.db.patch(existingVote._id, {
          type: args.type,
          createdAt: new Date().toISOString(),
        });
      }
    } else {
      await ctx.db.insert("votes", {
        userId: user._id,
        deviceId: args.deviceId,
        type: args.type,
        createdAt: new Date().toISOString(),
      });
    }

    const allDeviceVotes = await ctx.db
      .query("votes")
      .withIndex("by_device", (q) => q.eq("deviceId", args.deviceId))
      .collect();

    const deviceThumbsUp = allDeviceVotes.filter((v) => v.type === "up").length;
    const deviceThumbsDown = allDeviceVotes.filter(
      (v) => v.type === "down",
    ).length;

    await ctx.db.patch(args.deviceId, {
      totalVotes: {
        thumbsUp: deviceThumbsUp,
        thumbsDown: deviceThumbsDown,
      },
    });

    const updatedDevice = await ctx.db.get(args.deviceId);

    return {
      device: updatedDevice,
      userVote: newVote,
      message: "Vote recorded successfully!",
    };
  },
});
