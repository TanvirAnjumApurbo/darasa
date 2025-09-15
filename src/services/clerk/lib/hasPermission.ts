import { auth } from "@clerk/nextjs/server";

type Permission =
  | "unlimited_resume_analysis"
  | "unlimited_interviews"
  // Added singular form to be tolerant of potential feature flag naming mismatch
  | "unlimited_interview"
  | "unlimited_questions"
  | "1_interview"
  | "5_questions";

export async function hasPermission(permission: Permission) {
  const { has } = await auth();
  return has({ feature: permission });
}
