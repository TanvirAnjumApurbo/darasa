import { db } from "@/drizzle/db";
import {
  JobInfoTable,
  questionDifficulties,
  QuestionTable,
} from "@/drizzle/schema";
import { getJobInfoIdTag } from "@/features/jobInfos/dbCache";
import { insertQuestion } from "@/features/questions/db";
import { getQuestionJobInfoTag } from "@/features/questions/dbCache";
import { canCreateQuestion } from "@/features/questions/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
import { generateAiQuestion } from "@/services/ai/questions";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { and, asc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import z from "zod";

const schema = z.object({
  prompt: z.enum(questionDifficulties),
  jobInfoId: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response("Error generating your question", { status: 400 });
  }

  const { prompt: difficulty, jobInfoId } = result.data;
  const { userId } = await getCurrentUser();

  if (userId == null) {
    return new Response("You are not logged in", { status: 401 });
  }

  if (!(await canCreateQuestion())) {
    return new Response(PLAN_LIMIT_MESSAGE, { status: 403 });
  }

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (jobInfo == null) {
    return new Response("You do not have permission to do this", {
      status: 403,
    });
  }

  const previousQuestions = await getQuestions(jobInfoId);

  // Insert placeholder question first so we can return its ID in the response header.
  const { id: placeholderId } = await insertQuestion({
    text: "", // will update after generation completes
    jobInfoId,
    difficulty,
  });

  const streamResult = generateAiQuestion({
    previousQuestions,
    jobInfo,
    difficulty,
    onFinish: async (question) => {
      // Update the placeholder question with the final generated text.
      await db
        .update(QuestionTable)
        .set({ text: question })
        .where(eq(QuestionTable.id, placeholderId));
    },
  });

  // If streamResult has toDataStreamResponse prefer it to keep parity with feedback route.
  // @ts-expect-error Method exists at runtime in AI SDK stream result.
  if (typeof streamResult.toDataStreamResponse === "function") {
    // @ts-expect-error headers option may not be typed yet.
    return streamResult.toDataStreamResponse({
      sendUsage: false,
      headers: { "x-question-id": placeholderId },
    });
  }

  // Fallback: create a plain text streaming response.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textStream: ReadableStream<string> = (streamResult as any).textStream;
  return new Response(textStream, {
    headers: { "x-question-id": placeholderId },
  });
}

async function getQuestions(jobInfoId: string) {
  "use cache";
  cacheTag(getQuestionJobInfoTag(jobInfoId));

  return db.query.QuestionTable.findMany({
    where: eq(QuestionTable.jobInfoId, jobInfoId),
    orderBy: asc(QuestionTable.createdAt),
  });
}

async function getJobInfo(id: string, userId: string) {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, id), eq(JobInfoTable.userId, userId)),
  });
}
