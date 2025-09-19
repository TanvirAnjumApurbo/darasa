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
import { useMemo, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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
    <div className="flex flex-col items-center gap-2 sm:gap-4 w-full mx-w-[2000px] mx-auto flex-grow h-screen-header">
      <div className="w-full px-4 sm:container flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-4 items-start sm:items-center sm:justify-between">
        <div className="w-full sm:flex-grow sm:basis-0">
          <BackLink href={`/app/job-infos/${jobInfo.id}`}>
            {jobInfo.name}
          </BackLink>
        </div>
        <div className="w-full sm:w-auto flex justify-center">
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
            isMobile={isMobile}
          />
        </div>
        <div className="hidden sm:block sm:flex-grow" />
      </div>
      <QuestionContainer
        question={question}
        feedback={feedback}
        answer={answer}
        status={status}
        setAnswer={setAnswer}
        isGeneratingQuestion={isGeneratingQuestion}
        isGeneratingFeedback={isGeneratingFeedback}
        isMobile={isMobile}
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
  isMobile,
}: {
  question: string | null;
  feedback: string | null;
  answer: string | null;
  status: Status;
  setAnswer: (value: string) => void;
  isGeneratingQuestion: boolean;
  isGeneratingFeedback: boolean;
  isMobile: boolean;
}) {
  if (isMobile) {
    // Mobile layout: vertical stack instead of resizable panels
    return (
      <div className="flex flex-col h-full border-t">
        {/* Question and Feedback section */}
        <div className="flex-1 min-h-0 border-b">
          <ScrollArea className="h-full w-full">
            {status === "init" && question == null && !isGeneratingQuestion ? (
              <p className="text-sm sm:text-base flex items-center justify-center h-full p-4 text-center">
                Get started by selecting a question difficulty above.
              </p>
            ) : isGeneratingQuestion && !question ? (
              <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
                <TypingAnimation
                  text="Generating your interview question..."
                  className="text-sm sm:text-base text-center"
                />
                <ContentSkeleton lines={4} className="w-full max-w-sm" />
              </div>
            ) : (
              question && (
                <div className="relative h-full group">
                  <MarkdownRenderer className="p-4 h-full">
                    {question}
                  </MarkdownRenderer>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton
                      text={question}
                      label="Copy question"
                      variant="outline"
                      size="sm"
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )
            )}

            {isGeneratingFeedback && !feedback ? (
              <div className="border-t mt-4 pt-4">
                <div className="flex flex-col items-center justify-center p-4 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Analyzing your answer
                    </span>
                    <BouncingDots />
                  </div>
                  <ContentSkeleton lines={2} className="w-full max-w-sm" />
                </div>
              </div>
            ) : (
              feedback && (
                <div className="border-t mt-4 pt-4 relative group">
                  <MarkdownRenderer className="p-4">
                    {feedback}
                  </MarkdownRenderer>
                  <div className="absolute top-6 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton
                      text={feedback}
                      label="Copy feedback"
                      variant="outline"
                      size="sm"
                      className="bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              )
            )}
          </ScrollArea>
        </div>

        {/* Answer section */}
        <div className="flex-1 min-h-0">
          <div className="relative h-full group">
            <Textarea
              disabled={status !== "awaiting-answer"}
              onChange={(e) => setAnswer(e.target.value)}
              value={answer ?? ""}
              placeholder="Type your answer here..."
              className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset text-sm sm:text-base p-4"
            />
            {answer && answer.trim() !== "" && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton
                  text={answer}
                  label="Copy answer"
                  variant="outline"
                  size="sm"
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout: resizable panels
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-grow border-t h-full"
    >
      {/* Left side: Question + Feedback */}
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={30}>
        <ScrollArea className="h-full w-full">
          {status === "init" && question == null && !isGeneratingQuestion ? (
            <p className="text-sm sm:text-base md:text-lg flex items-center justify-center h-full p-4 sm:p-6">
              Get started by selecting a question difficulty above.
            </p>
          ) : isGeneratingQuestion && !question ? (
            <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 gap-4">
              <TypingAnimation
                text="Generating your interview question..."
                className="text-sm sm:text-base md:text-lg"
              />
              <ContentSkeleton lines={4} className="w-full max-w-md" />
            </div>
          ) : (
            question && (
              <div className="relative h-full group">
                <MarkdownRenderer className="p-4 sm:p-6 h-full">
                  {question}
                </MarkdownRenderer>
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyButton
                    text={question}
                    label="Copy question"
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            )
          )}{" "}
          {isGeneratingFeedback && !feedback ? (
            <div className="border-t mt-4 pt-4">
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm sm:text-base">
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
                <MarkdownRenderer className="p-4 sm:p-6">
                  {feedback}
                </MarkdownRenderer>
                <div className="absolute top-6 sm:top-8 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
            className="w-full h-full resize-none border-none rounded-none focus-visible:ring focus-visible:ring-inset text-sm sm:!text-base p-4 sm:p-6"
          />
          {answer && answer.trim() !== "" && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
  isMobile,
}: {
  disableAnswerButton: boolean;
  status: Status;
  isLoading: boolean;
  generateQuestion: (difficulty: QuestionDifficulty) => void;
  generateFeedback: () => void;
  reset: () => void;
  isMobile: boolean;
}) {
  return (
    <div className={`flex gap-2 ${isMobile ? "flex-wrap justify-center" : ""}`}>
      {status === "awaiting-answer" ? (
        <>
          <Button
            onClick={reset}
            disabled={isLoading}
            variant="outline"
            size={isMobile ? "default" : "sm"}
            className={isMobile ? "min-w-[80px]" : ""}
          >
            <LoadingSwap isLoading={isLoading}>Skip</LoadingSwap>
          </Button>
          <Button
            onClick={generateFeedback}
            disabled={disableAnswerButton}
            size={isMobile ? "default" : "sm"}
            className={isMobile ? "min-w-[80px]" : ""}
          >
            <LoadingSwap isLoading={isLoading}>Answer</LoadingSwap>
          </Button>
        </>
      ) : (
        questionDifficulties.map((difficulty) => (
          <Button
            key={difficulty}
            size={isMobile ? "default" : "sm"}
            disabled={isLoading}
            onClick={() => generateQuestion(difficulty)}
            className={isMobile ? "min-w-[80px] flex-1" : ""}
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
