"use server";

import { hasPermission } from "@/services/clerk/lib/hasPermission";

export type UserPlan = "free" | "pro" | "max";

export async function getUserPlan(): Promise<UserPlan> {
  const [
    unlimitedInterviewsPlural,
    unlimitedInterviewsSingular,
    unlimitedQuestions,
    unlimitedResumeAnalysis,
  ] = await Promise.all([
    hasPermission("unlimited_interviews").catch(() => false),
    hasPermission("unlimited_interview").catch(() => false),
    hasPermission("unlimited_questions").catch(() => false),
    hasPermission("unlimited_resume_analysis").catch(() => false),
  ]);

  const hasUnlimitedInterviews =
    unlimitedInterviewsPlural || unlimitedInterviewsSingular;

  if (hasUnlimitedInterviews && unlimitedResumeAnalysis) return "max";
  if (hasUnlimitedInterviews || unlimitedResumeAnalysis || unlimitedQuestions)
    return "pro";

  return "free";
}

export async function isProOrMax() {
  const plan = await getUserPlan();
  return plan !== "free";
}
