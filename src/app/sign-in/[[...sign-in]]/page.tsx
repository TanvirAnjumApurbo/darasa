import { SignIn } from "@clerk/nextjs";
import { signInLightAppearance } from "@/services/clerk/lib/signInAppearance";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn appearance={signInLightAppearance} />
    </div>
  );
}
