import { internalMutation } from "../_generated/server";

export const purgeExpiredSnapshots = internalMutation({
  args: {},
  handler: async (ctx) => {
    const nowIso = new Date().toISOString();

    // Purge deleted_codes
    const expiredCodes = await ctx.db
      .query("deleted_codes")
      .withIndex("by_purge_at", (q) => q.lte("purgeAt", nowIso))
      .collect();

    for (const item of expiredCodes) {
      await ctx.db.delete(item._id);
    }

    // Purge deleted_devices
    const expiredDevices = await ctx.db
      .query("deleted_devices")
      .withIndex("by_purge_at", (q) => q.lte("purgeAt", nowIso))
      .collect();

    for (const item of expiredDevices) {
      await ctx.db.delete(item._id);
    }

    return {
      purgedCodes: expiredCodes.length,
      purgedDevices: expiredDevices.length,
    };
  },
});
