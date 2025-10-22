import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAllDevices = query({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db.query("devices").collect();

    const devicesWithCodes = await Promise.all(
      devices.map(async (device) => {
        const codes = await ctx.db
          .query("codes")
          .withIndex("by_device", (q) => q.eq("deviceId", device._id))
          .collect();

        const author = await ctx.db.get(device.authorId);

        const formattedCodes = await Promise.all(
          codes.map(async (code) => {
            const codeAuthor = await ctx.db.get(code.authorId);

            let userVote = null;
            const identity = await ctx.auth.getUserIdentity();
            if (identity) {
              const clerkId = identity.subject;
              const currentUser = await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
                .first();

              if (currentUser) {
                const vote = await ctx.db
                  .query("votes")
                  .withIndex("by_user_code", (q) =>
                    q.eq("userId", currentUser._id).eq("codeId", code._id),
                  )
                  .first();
                userVote = vote?.type || null;
              }
            }

            return {
              id: code._id,
              name: code.name,
              code: code.code,
              uploadedBy: codeAuthor?.name || "unknown",
              uploadedByImage: codeAuthor?.image || "",
              uploadedAt: code.uploadedAt,
              votes: code.votes,
              userVote,
            };
          }),
        );

        return {
          id: device._id,
          name: device.name,
          manufacturer: device.manufacturer,
          model: device.model,
          deviceType: device.deviceType,
          codes: formattedCodes,
          notes: device.notes,
          uploadedBy: author?.name || "unknown",
          uploadedByImage: author?.image || "",
          uploadedAt: device.uploadedAt,
          totalVotes: device.totalVotes,
        };
      }),
    );

    return devicesWithCodes;
  },
});

export const getDeviceById = query({
  args: { id: v.id("devices") },
  handler: async (ctx, args) => {
    const device = await ctx.db.get(args.id);
    if (!device) {
      return null;
    }

    const codes = await ctx.db
      .query("codes")
      .withIndex("by_device", (q) => q.eq("deviceId", device._id))
      .collect();

    const author = await ctx.db.get(device.authorId);

    const formattedCodes = await Promise.all(
      codes.map(async (code) => {
        const codeAuthor = await ctx.db.get(code.authorId);

        let userVote = null;
        const identity = await ctx.auth.getUserIdentity();
        if (identity) {
          const clerkId = identity.subject;
          const currentUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
            .first();

          if (currentUser) {
            const vote = await ctx.db
              .query("votes")
              .withIndex("by_user_code", (q) =>
                q.eq("userId", currentUser._id).eq("codeId", code._id),
              )
              .first();
            userVote = vote?.type || null;
          }
        }

        return {
          id: code._id,
          name: code.name,
          code: code.code,
          uploadedBy: codeAuthor?.name || "unknown",
          uploadedByImage: codeAuthor?.image || "",
          uploadedAt: code.uploadedAt,
          votes: code.votes,
          userVote,
        };
      }),
    );

    return {
      id: device._id,
      name: device.name,
      manufacturer: device.manufacturer,
      model: device.model,
      deviceType: device.deviceType,
      codes: formattedCodes,
      notes: device.notes,
      uploadedBy: author?.name || "unknown",
      uploadedByImage: author?.image || "",
      uploadedAt: device.uploadedAt,
      totalVotes: device.totalVotes,
    };
  },
});

export const getDevicesByCategory = query({
  args: { deviceType: v.string() },
  handler: async (ctx, args) => {
    // Fetch all devices and filter by deviceType case-insensitively
    const allDevices = await ctx.db.query("devices").collect();
    const devices = allDevices.filter(
      (device) =>
        device.deviceType &&
        device.deviceType.toLowerCase() === args.deviceType.toLowerCase(),
    );

    const devicesWithCodes = await Promise.all(
      devices.map(async (device) => {
        const codes = await ctx.db
          .query("codes")
          .withIndex("by_device", (q) => q.eq("deviceId", device._id))
          .collect();

        const author = await ctx.db.get(device.authorId);

        const formattedCodes = await Promise.all(
          codes.map(async (code) => {
            const codeAuthor = await ctx.db.get(code.authorId);

            let userVote = null;
            const identity = await ctx.auth.getUserIdentity();
            if (identity) {
              const clerkId = identity.subject;
              const currentUser = await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
                .first();

              if (currentUser) {
                const vote = await ctx.db
                  .query("votes")
                  .withIndex("by_user_code", (q) =>
                    q.eq("userId", currentUser._id).eq("codeId", code._id),
                  )
                  .first();
                userVote = vote?.type || null;
              }
            }

            return {
              id: code._id,
              name: code.name,
              code: code.code,
              uploadedBy: codeAuthor?.name || "unknown",
              uploadedByImage: codeAuthor?.image || "",
              uploadedAt: code.uploadedAt,
              votes: code.votes,
              userVote,
            };
          }),
        );

        return {
          id: device._id,
          name: device.name,
          manufacturer: device.manufacturer,
          model: device.model,
          deviceType: device.deviceType,
          codes: formattedCodes,
          notes: device.notes,
          uploadedBy: author?.name || "unknown",
          uploadedByImage: author?.image || "",
          uploadedAt: device.uploadedAt,
          totalVotes: device.totalVotes,
        };
      }),
    );

    return devicesWithCodes;
  },
});

export const searchDevices = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const deviceResults = await ctx.db
      .query("devices")
      .withSearchIndex("search_devices", (q) =>
        q.search("name", args.searchTerm),
      )
      .collect();

    const manufacturerResults = await ctx.db
      .query("devices")
      .filter((q) =>
        q.or(
          q.eq(q.field("manufacturer"), args.searchTerm),
          q.eq(q.field("deviceType"), args.searchTerm),
        ),
      )
      .collect();

    const allDevices = [...deviceResults, ...manufacturerResults];
    const uniqueDevices = allDevices.filter(
      (device, index, self) =>
        index === self.findIndex((d) => d._id === device._id),
    );

    const devicesWithCodes = await Promise.all(
      uniqueDevices.map(async (device) => {
        const codes = await ctx.db
          .query("codes")
          .withIndex("by_device", (q) => q.eq("deviceId", device._id))
          .collect();

        const author = await ctx.db.get(device.authorId);

        const formattedCodes = await Promise.all(
          codes.map(async (code) => {
            const codeAuthor = await ctx.db.get(code.authorId);

            let userVote = null;
            const identity = await ctx.auth.getUserIdentity();
            if (identity) {
              const clerkId = identity.subject;
              const currentUser = await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
                .first();

              if (currentUser) {
                const vote = await ctx.db
                  .query("votes")
                  .withIndex("by_user_code", (q) =>
                    q.eq("userId", currentUser._id).eq("codeId", code._id),
                  )
                  .first();
                userVote = vote?.type || null;
              }
            }

            return {
              id: code._id,
              name: code.name,
              code: code.code,
              uploadedBy: codeAuthor?.name || "unknown",
              uploadedByImage: codeAuthor?.image || "",
              uploadedAt: code.uploadedAt,
              votes: code.votes,
              userVote,
            };
          }),
        );

        return {
          id: device._id,
          name: device.name,
          manufacturer: device.manufacturer,
          model: device.model,
          deviceType: device.deviceType,
          codes: formattedCodes,
          notes: device.notes,
          uploadedBy: author?.name || "unknown",
          uploadedByImage: author?.image || "",
          uploadedAt: device.uploadedAt,
          totalVotes: device.totalVotes,
        };
      }),
    );

    return devicesWithCodes;
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    return users.map((user) => ({
      id: user._id,
      name: user.name,
      avatar: user.image,
      clerkId: user.clerkId,
      emailVerificationTime: user.emailVerificationTime,
    }));
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      return null;
    }

    return {
      id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.image,
      clerkId: user.clerkId,
      emailVerificationTime: user.emailVerificationTime,
      createdAt: user.createdAt,
      role: user.role || "user",
      image: user.image, // Also provide the raw image field
    };
  },
});

export const viewer = query({
  args: { lastUpsert: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    console.log("[VIEWER] Identity object:", identity);

    if (!identity) {
      return null;
    }

    // Extract Clerk user ID from identity
    const clerkId = identity.subject;
    console.log("[VIEWER] Clerk ID:", clerkId);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (user) {
      console.log("[VIEWER] Found existing user:", user._id);
      return user;
    }

    // Return identity data for new users (don't auto-create)
    console.log("[VIEWER] New user - returning identity data");
    return {
      name: identity.name || "Anonymous",
      image: identity.pictureUrl || "",
      clerkId: clerkId,
      username: identity.nickname || identity.name?.split(" ")[0] || "user",
      _isTemporary: true, // Flag to indicate this is not a persisted user
    };
  },
});

export const getCategoryStats = query({
  args: {},
  handler: async (ctx) => {
    const devices = await ctx.db.query("devices").collect();

    const categoryMap = new Map();

    for (const device of devices) {
      const category = device.deviceType;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          count: 0,
          devices: [],
          totalCodes: 0,
          effectiveness: 0,
        });
      }

      const categoryData = categoryMap.get(category);
      categoryData.count += 1;
      categoryData.devices.push(device);

      const codes = await ctx.db
        .query("codes")
        .withIndex("by_device", (q) => q.eq("deviceId", device._id))
        .collect();

      categoryData.totalCodes += codes.length;

      const totalVotes =
        device.totalVotes.thumbsUp + device.totalVotes.thumbsDown;
      if (totalVotes > 0) {
        categoryData.effectiveness +=
          (device.totalVotes.thumbsUp / totalVotes) * 100;
      }
    }

    const categories = Array.from(categoryMap.values()).map((data) => ({
      ...data,
      effectiveness:
        data.count > 0 ? Math.round(data.effectiveness / data.count) : 0,
    }));

    return categories.sort((a, b) => b.count - a.count);
  },
});
