import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Prefer NEXT_PUBLIC_CONVEX_URL if present; fall back to CONVEX_URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!convexUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "Convex URL is not set. Please define NEXT_PUBLIC_CONVEX_URL or CONVEX_URL in your environment.",
  );
}

const client = new ConvexHttpClient(convexUrl || "");

/**
 * Upsert a user via mutation (called from Clerk webhook handler).
 * Used by Clerk webhook handler to sync user data.
 *
 * SECURITY: The mutation validates that no role field is passed to prevent privilege escalation.
 * Role field is explicitly excluded from args to prevent privilege escalation.
 */
export async function upsertUserServer(args: {
  clerkId: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  emailVerificationTime?: number;
  // SECURITY: role is explicitly NOT included to prevent privilege escalation
}) {
  return client.mutation(api.mutations.users.upsertUser, args);
}

/**
 * Delete a user via mutation (called from Clerk webhook handler).
 * Used by Clerk webhook handler to handle user deletion events.
 */
export async function deleteUserServer(args: { clerkId: string }) {
  return client.mutation(api.mutations.users.deleteUser, args);
}
