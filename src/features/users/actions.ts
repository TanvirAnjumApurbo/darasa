"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag } from "./dbCache";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { upsertUser } from "./db";

export async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}

export async function createUserFromClerk() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("No authenticated user found");
    }

    // Check if user already exists in database
    const existingUser = await getUser(userId);
    if (existingUser) {
      return existingUser;
    }

    // Get user data from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Failed to get user data from Clerk");
    }

    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      throw new Error("No primary email found");
    }

    console.log("🛠️ Manually creating user from Clerk data:", userId, email);

    // Create user in database
    await upsertUser({
      id: userId,
      email,
      name:
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "User",
      imageUrl: clerkUser.imageUrl,
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
    });

    // Return the created user
    return await getUser(userId);
  } catch (error) {
    console.error("❌ Failed to create user from Clerk:", error);
    throw error;
  }
}
