import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { deleteUserServer, upsertUserServer } from "@/lib/convex-server-client";

function emailLocalPart(email?: string | null): string | undefined {
  if (!email) return undefined;
  const i = email.indexOf("@");
  if (i === -1) return email || undefined;
  const local = email.slice(0, i).trim();
  return local || undefined;
}

export async function POST(request: Request) {
  const payload: WebhookEvent = await request.json();
  console.log("Webhook received:", payload);

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
      const primaryEmailObj = emailAddresses.find((e) => e?.id === primaryEmailId) ?? null;
      const email = primaryEmailObj?.email_address ?? undefined;

      const emailVerificationTime = primaryEmailObj?.verification?.status === "verified" ? Date.now() : undefined;

      const firstName = payload.data.first_name ?? undefined;
      const lastName = payload.data.last_name ?? undefined;
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

      // Name fallback priority: fullName -> email local-part -> "user"
      const name = fullName || emailLocalPart(email) || "user";

      const username = payload.data.username ?? emailLocalPart(email) ?? undefined;
      const image = payload.data.image_url ?? undefined;

      console.log("Upserting user:", { clerkId, name, email, username, image, emailVerificationTime });

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
