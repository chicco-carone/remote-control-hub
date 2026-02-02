import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { deleteUserServer, upsertUserServer } from "@/lib/convex-server-client";

function emailLocalPart(email?: string | null): string | undefined {
  if (!email) return undefined;
  const i = email.indexOf("@");
  if (i === -1) return email || undefined;
  const local = email.slice(0, i).trim();
  return local || undefined;
}

export async function POST(request: Request) {
  // Verify webhook signature for security
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET not configured");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  // Get Svix headers for signature verification
  const svix_id = request.headers.get("svix-id");
  const svix_timestamp = request.headers.get("svix-timestamp");
  const svix_signature = request.headers.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  // Get the raw body for signature verification
  const body = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let payload: WebhookEvent;

  try {
    payload = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 401 });
  }

  console.log("Webhook received and verified:", payload);

  try {
    if (payload.type === "user.deleted") {
      const clerkId = payload.data.id;
      if (!clerkId) return NextResponse.json({ ok: true });
      console.log("Deleting user:", clerkId);
      await deleteUserServer({ clerkId });
      return NextResponse.json({ ok: true });
    }

    if (payload.type === "user.created" || payload.type === "user.updated") {
      const clerkId = payload.data.id;
      if (!clerkId) return NextResponse.json({ ok: true });

      const primaryEmailId = payload.data.primary_email_address_id;
      const emailAddresses = Array.isArray(payload.data.email_addresses)
        ? payload.data.email_addresses
        : [];
      const primaryEmailObj =
        emailAddresses.find((e) => e?.id === primaryEmailId) ?? null;
      const email = primaryEmailObj?.email_address ?? undefined;

      const emailVerificationTime =
        primaryEmailObj?.verification?.status === "verified"
          ? Date.now()
          : undefined;

      const firstName = payload.data.first_name ?? undefined;
      const lastName = payload.data.last_name ?? undefined;
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

      // Name fallback priority: fullName -> email local-part -> "user"
      const name = fullName || emailLocalPart(email) || "user";

      const username =
        payload.data.username ?? emailLocalPart(email) ?? undefined;
      const image = payload.data.image_url ?? undefined;

      console.log("Upserting user:", {
        clerkId,
        name,
        email,
        username,
        image,
        emailVerificationTime,
      });

      await upsertUserServer({
        clerkId,
        name,
        email,
        username,
        image,
        emailVerificationTime,
      });

      return NextResponse.json({ ok: true });
    }

    // Ignore other event types
    console.log("Ignored event type:", payload.type);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook handling error:", error);
    return new NextResponse("Webhook handling error", { status: 500 });
  }
}
