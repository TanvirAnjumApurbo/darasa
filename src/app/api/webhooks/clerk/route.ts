import { deleteUser, upsertUser } from "@/features/users/db";
import { Webhook } from "svix";
import { headers } from "next/headers";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{
      id: string;
      email_address: string;
    }>;
    primary_email_address_id: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    created_at: number;
    updated_at: number;
  };
}

export async function POST(request: Request) {
  try {
    console.log("🔄 Clerk webhook received");

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("❌ Missing svix headers");
      return new Response("Error occured -- no svix headers", {
        status: 400,
      });
    }

    // Get the body
    const payload = await request.text();

    // Create a new Svix instance with your secret.
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET!);

    let event: ClerkWebhookEvent;

    // Verify the payload with the headers
    try {
      event = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as ClerkWebhookEvent;
      console.log("✅ Webhook verified, event type:", event.type);
    } catch (err) {
      console.error("❌ Error verifying webhook:", err);
      return new Response("Error occured", {
        status: 400,
      });
    }

    switch (event.type) {
      case "user.created":
      case "user.updated":
        console.log("👤 Processing user:", event.type);
        const clerkData = event.data;
        const email = clerkData.email_addresses.find(
          (e) => e.id === clerkData.primary_email_address_id
        )?.email_address;
        if (email == null) {
          console.log("❌ No primary email found");
          return new Response("No primary email found", { status: 400 });
        }

        console.log("💾 Upserting user:", clerkData.id, email);
        await upsertUser({
          id: clerkData.id,
          email,
          name:
            `${clerkData.first_name || ""} ${
              clerkData.last_name || ""
            }`.trim() || "User",
          imageUrl: clerkData.image_url || null,
          createdAt: new Date(clerkData.created_at),
          updatedAt: new Date(clerkData.updated_at),
        });
        console.log("✅ User upserted successfully");

        break;
      case "user.deleted":
        if (event.data.id == null) {
          console.log("❌ No user ID found for deletion");
          return new Response("No user ID found", { status: 400 });
        }

        console.log("🗑️ Deleting user:", event.data.id);
        await deleteUser(event.data.id);
        console.log("✅ User deleted successfully");
        break;
      default:
        console.log("⚠️ Unhandled event type:", event.type);
    }
  } catch (error) {
    console.error(
      "❌ Webhook error:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "❌ Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return new Response("Invalid webhook", { status: 400 });
  }

  console.log("✅ Webhook processed successfully");
  return new Response("Webhook received", { status: 200 });
}

// Add a GET endpoint to test webhook URL accessibility
export async function GET() {
  return new Response("Clerk webhook endpoint is working", { status: 200 });
}
