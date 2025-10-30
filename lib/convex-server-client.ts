import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Prefer NEXT_PUBLIC_CONVEX_URL if present; fall back to CONVEX_URL
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

if (!convexUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "Convex URL is not set. Please define NEXT_PUBLIC_CONVEX_URL or CONVEX_URL in your environment."
  );
}

const client = new ConvexHttpClient(convexUrl || "");

export async function upsertUserServer(args: {
  clerkId: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  emailVerificationTime?: number;
}) {
  return client.mutation(api.mutations.users.upsertUser, args);
}

export async function deleteUserServer(args: { clerkId: string }) {
  return client.mutation(api.mutations.users.deleteUser, args);
}
