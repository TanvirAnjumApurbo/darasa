"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";
import { JobInfoTable } from "@/drizzle/schema";
import { deleteJobInfo as deleteJobInfoAction } from "@/features/jobInfos/actions";

type JobInfo = typeof JobInfoTable.$inferSelect;

type JobInfosGridProps = {
  jobInfos: JobInfo[];
};

export function JobInfosGrid({ jobInfos }: JobInfosGridProps) {
  const [query, setQuery] = useState("");

  const filteredJobInfos = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return jobInfos;
    }

    return jobInfos.filter((jobInfo) => {
      const haystack = [jobInfo.name, jobInfo.title ?? "", jobInfo.description]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [jobInfos, query]);

  return (
    <div className="container my-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-2 sm:justify-between sm:items-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl">
            Select a Job Description
          </h1>
          <Button asChild className="w-fit sm:w-auto">
            <Link href="/app/job-infos/new">
              <PlusIcon />
              Create Job Description
            </Link>
          </Button>
        </div>

        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search job descriptions"
            className="pl-9"
            placeholder="Search name, title, or description"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 has-hover:*:not-hover:opacity-70">
        {filteredJobInfos.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              <p className="text-base">
                No job descriptions matched{" "}
                <span className="font-medium">“{query.trim()}”</span>.
              </p>
              <p className="text-sm">
                Try a different keyword or create a new job description.
              </p>
            </CardContent>
          </Card>
        )}

        {filteredJobInfos.map((jobInfo) => (
          <JobInfoCard jobInfo={jobInfo} key={jobInfo.id} />
        ))}

        <Link
          className="transition-opacity"
          href="/app/job-infos/new"
          aria-label="Create a new job description"
        >
          <Card className="flex h-full items-center justify-center border-3 border-dashed bg-transparent shadow-none transition-colors hover:border-primary/50">
            <div className="flex items-center gap-2 text-lg">
              <PlusIcon className="size-6" />
              New Job Description
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function JobInfoCard({ jobInfo }: { jobInfo: JobInfo }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(() => {
      deleteJobInfoAction(jobInfo.id)
        .then((result) => {
          if (result?.error) {
            toast.error(result.message);
            return;
          }

          if (result?.redirectTo) {
            router.replace(result.redirectTo);
            return;
          }

          router.refresh();
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            "Something went wrong while deleting the job description."
          );
        });
    });
  };

  return (
    <Card className="relative h-full">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            aria-label={`Delete ${jobInfo.name}`}
            className="absolute right-3 top-3 text-muted-foreground hover:text-destructive"
            disabled={isPending}
            size="icon"
            variant="ghost"
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <Trash2Icon className="size-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job description?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently remove{" "}
              <span className="font-semibold">
                &ldquo;{jobInfo.name}&rdquo;
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Link
        className="flex h-full flex-col"
        href={`/app/job-infos/${jobInfo.id}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="truncate text-lg">{jobInfo.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 pt-0">
          <p className="line-clamp-3 text-muted-foreground">
            {jobInfo.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 pt-0">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex-shrink-0">
              {formatExperienceLevel(jobInfo.experienceLevel)}
            </Badge>
            {jobInfo.title && (
              <Badge variant="outline" className="flex-shrink-0">
                {jobInfo.title}
              </Badge>
            )}
          </div>
          <ArrowRightIcon className="size-6 text-muted-foreground" />
        </CardFooter>
      </Link>
    </Card>
  );
}
