"use client";

import { getUser, createUserFromClerk } from "@/features/users/actions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [isCreatingManually, setIsCreatingManually] = useState(false);
  const maxAttempts = 40; // 10 seconds at 250ms intervals

  useEffect(() => {
    console.log("🔄 Starting onboarding check for user:", userId);
    let currentAttempts = 0;
    let isManualCreationStarted = false;

    const intervalId = setInterval(async () => {
      try {
        currentAttempts++;
        setAttempts(currentAttempts);

        console.log(
          `🔍 Checking user existence, attempt ${currentAttempts}/${maxAttempts}`
        );
        const user = await getUser(userId);

        if (user != null) {
          console.log("✅ User found in database, redirecting to /app");
          clearInterval(intervalId);
          router.replace("/app");
          return;
        }

        if (currentAttempts >= maxAttempts && !isManualCreationStarted) {
          console.log(
            "❌ Max attempts reached, webhook failed - trying manual creation"
          );
          isManualCreationStarted = true;
          setIsCreatingManually(true);
          clearInterval(intervalId);

          // Try to create user manually from Clerk data
          try {
            await createUserFromClerk();
            console.log("✅ User created manually, redirecting");
            router.replace("/app");
          } catch (error) {
            console.error("❌ Manual user creation failed:", error);
            router.replace("/app?error=user_creation_failed");
          }
        }
      } catch (error) {
        console.error("❌ Error checking user:", error);
      }
    }, 250);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, router]); // Remove attempts and isCreatingManually from dependencies

  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2Icon className="animate-spin size-24" />
      {isCreatingManually ? (
        <p className="text-sm text-blue-600">
          Setting up your account manually...
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Attempt {attempts + 1} of {maxAttempts}
          </p>
          {attempts > 20 && (
            <p className="text-sm text-yellow-600">
              Taking longer than usual... Please wait
            </p>
          )}
        </>
      )}
    </div>
  );
}
