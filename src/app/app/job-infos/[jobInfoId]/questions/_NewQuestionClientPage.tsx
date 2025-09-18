"use client";

import { BackLink } from "@/components/BackLink";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { TypingAnimation } from "@/components/ui/typing-animation";
import {
  BouncingDots,
  ContentSkeleton,
} from "@/components/ui/loading-animations";
import { CopyButton } from "@/components/ui/copy-button";
import {
  JobInfoTable,
  questionDifficulties,
  QuestionDifficulty,
} from "@/drizzle/schema";
import { formatQuestionDifficulty } from "@/features/questions/formatters";
import { useMemo, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { errorToast } from "@/lib/errorToast";
import z from "zod";

type Status = "awaiting-answer" | "awaiting-difficulty" | "init";

export function NewQuestionClientPage({
  jobInfo,
}: {
  jobInfo: Pick<typeof JobInfoTable.$inferSelect, "id" | "name" | "title">;
}) {
  const [status, setStatus] = useState<Status>("init");
  const [answer, setAnswer] = useState<string | null>(null);

  const {
    complete: generateQuestion,
    completion: question,
    setCompletion: setQuestion,
    isLoading: isGeneratingQuestion,
    data,
  } = useCompletion({
    api: "/api/ai/questions/generate-question",
    onFinish: () => {
      setStatus("awaiting-answer");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const {
    complete: generateFeedback,
    completion: feedback,
    setCompletion: setFeedback,
    isLoading: isGeneratingFeedback,
  } = useCompletion({
    api: "/api/ai/questions/generate-feedback",
    onFinish: () => {
      setStatus("awaiting-difficulty");
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const questionId = useMemo(() => {
    const item = data?.at(-1);
    if (item == null) return null;
    const parsed = z.object({ questionId: z.string() }).safeParse(item);
    if (!parsed.success) return null;

    return parsed.data.questionId;
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-4 w-full mx-w-[2000px] mx-auto flex-grow h-screen-header">
      <div className="container flex gap-4 mt-4 items-center justify-between">
        <div className="flex-grow basis-0">
          <BackLink href={`/app/job-infos/${jobInfo.id}`}>
            {jobInfo.name}
          </BackLink>
        </div>
        <Controls
          reset={() => {
            setStatus("init");
            setQuestion("");
            setFeedback("");
            setAnswer(null);
          }}
          disableAnswerButton={
            answer == null || answer.trim() === "" || questionId == null
          }
          status={status}
          isLoading={isGeneratingFeedback || isGeneratingQuestion}
          generateFeedback={() => {
            if (answer == null || answer.trim() === "" || questionId == null)
              return;

            generateFeedback(answer?.trim(), { body: { questionId } });
          }}
          generateQuestion={(difficulty) => {
            setQuestion("");
            setFeedback("");
            setAnswer(null);
            generateQuestion(difficulty, { body: { jobInfoId: jobInfo.id } });
          }}
        />
        <div className="flex-grow hidden md:block" />
      </div>
      <QuestionContainer
        question={question}
        feedback={feedback}
        answer={answer}
        status={status}
        setAnswer={setAnswer}
        isGeneratingQuestion={isGeneratingQuestion}
        isGeneratingFeedback={isGeneratingFeedback}
      />
    </div>
  );
}

function QuestionContainer({
  question,
  feedback,
  answer,
  status,
  setAnswer,
  isGeneratingQuestion,
  isGeneratingFeedback,
}: {
  question: string | null;
  feedback: string | null;
  answer: string | null;
  status: Status;
  setAnswer: (value: string) => void;
  isGeneratingQuestion: boolean;
  isGeneratingFeedback: boolean;
}) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-grow border-t h-full"
    >
      {/* Left side: Question + Feedback */}
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={30}>
        <ScrollArea className="h-full w-full">
          {status === "init" && question == null && !isGeneratingQuestion ? (
            <p className="text-base md:text-lg flex items-center justify-center h-full p-6">
              Get started by selecting a question difficulty above.
            </p>
          ) : isGeneratingQuestion && !question ? (
            <div className="flex flex-col items-center justify-center h-full p-6 gap-4">
              <TypingAnimation
                text="Generating your interview question..."
                className="text-base md:text-lg"
              />
              <ContentSkeleton lines={4} className="w-full max-w-md" />
            </div>
          ) : (
            question && (
              <div className="relative h-full group">
                <MarkdownRenderer className="p-6 h-full">
                  {question}
                </MarkdownRenderer>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    text={question}
                    label="Copy question"
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            )
          )}

          {isGeneratingFeedback && !feedback ? (
            <div className="border-t mt-4 pt-4">
              <div className="flex flex-col items-center justify-center p-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    Analyzing your answer
                  </span>
                  <BouncingDots />
                </div>
                <ContentSkeleton lines={2} className="w-full max-w-md" />
              </div>
            </div>
          ) : (
            feedback && (
              <div className="border-t mt-4 pt-4 relative group">
                <MarkdownRenderer className="p-6">{feedback}</MarkdownRenderer>
                <div className="absolute top-8 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    text={feedback}
                    label="Copy feedback"
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            )
          )}
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right side: Answer */}
      <ResizablePanel id="answer" defaultSize={50} minSize={30}>
        <div className="relative h-full group">
          <Textarea
            disabled={status !== "awaiting-answer"}
            onChange={(e) => setAnswer(e.target.value)}
            value={answer ?? ""}
            placeholder="Type your answer here..."
            className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset !text-base p-6"
          />
          {answer && answer.trim() !== "" && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton
                text={answer}
                label="Copy answer"
                variant="outline"
                className="bg-background/80 backdrop-blur-sm"
              />
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function Controls({
  status,
  isLoading,
  disableAnswerButton,
  generateQuestion,
  generateFeedback,
  reset,
}: {
  disableAnswerButton: boolean;
  status: Status;
  isLoading: boolean;
  generateQuestion: (difficulty: QuestionDifficulty) => void;
  generateFeedback: () => void;
  reset: () => void;
}) {
  return (
    <div className="flex gap-2">
      {status === "awaiting-answer" ? (
        <>
          <Button
            onClick={reset}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <LoadingSwap isLoading={isLoading}>Skip</LoadingSwap>
          </Button>
          <Button
            onClick={generateFeedback}
            disabled={disableAnswerButton}
            size="sm"
          >
            <LoadingSwap isLoading={isLoading}>Answer</LoadingSwap>
          </Button>
        </>
      ) : (
        questionDifficulties.map((difficulty) => (
          <Button
            key={difficulty}
            size="sm"
            disabled={isLoading}
            onClick={() => generateQuestion(difficulty)}
          >
            <LoadingSwap isLoading={isLoading}>
              {formatQuestionDifficulty(difficulty)}
            </LoadingSwap>
          </Button>
        ))
      )}
    </div>
  );
}
