import { db } from "@/drizzle/db";
import { InterviewTable, JobInfoTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { hasPermission } from "@/services/clerk/lib/hasPermission";
import { and, count, eq, isNotNull } from "drizzle-orm";

const LIMITED_INTERVIEW_ALLOWANCE = 2;

export async function canCreateInterview() {
  // Allow either plural or singular unlimited feature flag names for resilience.
  const [unlimitedPlural, unlimitedSingular] = await Promise.all([
    hasPermission("unlimited_interviews").catch(() => false),
    hasPermission("unlimited_interview").catch(() => false),
  ]);

  if (unlimitedPlural || unlimitedSingular) return true;

  // Fallback to limited interview allowance
  const [limitedInterviewPermitted, interviewCount] = await Promise.all([
    hasPermission("1_interview"),
    getUserInterviewCount(),
  ]);

  if (limitedInterviewPermitted && interviewCount < LIMITED_INTERVIEW_ALLOWANCE)
    return true;

  return false;
}

async function getUserInterviewCount() {
  const { userId } = await getCurrentUser();
  if (userId == null) return 0;

  return getInterviewCount(userId);
}

async function getInterviewCount(userId: string) {
  const [{ count: c }] = await db
    .select({ count: count() })
    .from(InterviewTable)
    .innerJoin(JobInfoTable, eq(InterviewTable.jobInfoId, JobInfoTable.id))
    .where(
      and(eq(JobInfoTable.userId, userId), isNotNull(InterviewTable.humeChatId))
    );

  return c;
}
