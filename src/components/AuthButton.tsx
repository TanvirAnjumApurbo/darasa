import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { signInLightAppearance } from "@/services/clerk/lib/signInAppearance";

interface AuthButtonProps {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function AuthButton({
  children,
  size,
  className,
  variant,
}: AuthButtonProps) {
  return (
    <Suspense
      fallback={
        <SignInButton
          forceRedirectUrl="/app"
          appearance={signInLightAppearance}
        >
          <Button size={size} className={className} variant={variant}>
            {children}
          </Button>
        </SignInButton>
      }
    >
      <AuthButtonInner size={size} className={className} variant={variant}>
        {children}
      </AuthButtonInner>
    </Suspense>
  );
}

async function AuthButtonInner({
  children,
  size,
  className,
  variant,
}: AuthButtonProps) {
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return (
      <SignInButton forceRedirectUrl="/app" appearance={signInLightAppearance}>
        <Button size={size} className={className} variant={variant}>
          {children}
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button asChild size={size} className={className} variant={variant}>
      <Link href="/app">{children}</Link>
    </Button>
  );
}
