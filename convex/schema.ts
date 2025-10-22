import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.optional(v.string()),
    username: v.string(),
    image: v.string(),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("user"), v.literal("guest")),
    ),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"]),
  devices: defineTable({
    name: v.string(),
    manufacturer: v.string(),
    model: v.optional(v.string()),
    deviceType: v.string(),
    notes: v.optional(v.string()),
    authorId: v.id("users"),
    uploadedAt: v.string(),
    totalVotes: v.object({
      thumbsUp: v.number(),
      thumbsDown: v.number(),
    }),
  })
    .index("by_author", ["authorId"])
    .index("by_device_type", ["deviceType"])
    .index("by_manufacturer", ["manufacturer"])
    .index("by_upload_date", ["uploadedAt"])
    .searchIndex("search_devices", {
      searchField: "name",
      filterFields: ["deviceType", "manufacturer"],
    }),

  codes: defineTable({
    deviceId: v.id("devices"),
    name: v.string(),
    code: v.string(),
    authorId: v.id("users"),
    uploadedAt: v.string(),
    votes: v.object({
      thumbsUp: v.number(),
      thumbsDown: v.number(),
    }),
  })
    .index("by_device", ["deviceId"])
    .index("by_author", ["authorId"])
    .index("by_upload_date", ["uploadedAt"])
    .searchIndex("search_codes", {
      searchField: "name",
      filterFields: ["code"],
    }),

  votes: defineTable({
    userId: v.id("users"),
    codeId: v.optional(v.id("codes")),
    deviceId: v.id("devices"),
    type: v.union(v.literal("up"), v.literal("down")),
    createdAt: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_code", ["codeId"])
    .index("by_device", ["deviceId"])
    .index("by_user_code", ["userId", "codeId"])
    .index("by_user_device", ["userId", "deviceId"]),
});
