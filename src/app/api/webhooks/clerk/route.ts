import { deleteUser, upsertUser } from "@/features/users/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Clerk webhook received");
    const event = await verifyWebhook(request);
    console.log("✅ Webhook verified, event type:", event.type);

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
          name: `${clerkData.first_name} ${clerkData.last_name}`,
          imageUrl: clerkData.image_url,
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
