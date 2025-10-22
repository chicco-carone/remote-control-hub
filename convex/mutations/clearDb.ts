import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

/**
 * Internal mutation to clear all documents from every table in the database.
 * Requires a confirmation string to prevent accidental execution.
 * Run manually from the Convex dashboard or a secure admin tool.
 */
export const internalClearDb = internalMutation({
  args: { confirmation: v.string() },
  handler: async (ctx, args) => {
    if (args.confirmation !== "CONFIRM_CLEAR_DB") {
      throw new Error("Invalid confirmation string. Database clear aborted.");
    }
    const tables = [
      "users",
      "devices",
      "codes",
      "votes",
      "authAccounts",
      "authRateLimits",
      "authSessions",
      "authRefreshTokens",
      "authVerificationCodes",
      "authVerifiers",
    ];
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }
    return null;
  },
});
