import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { getUserPlan } from "@/features/users/plan";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "./_Navbar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (userId == null) return redirect("/");
  if (user == null) return redirect("/onboarding");

  const plan = await getUserPlan();

  return (
    <>
      <Navbar user={user} plan={plan} />
      {children}
    </>
  );
}
