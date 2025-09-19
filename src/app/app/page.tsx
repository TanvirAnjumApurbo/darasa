import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { JobInfoTable } from "@/drizzle/schema";
import { JobInfoForm } from "@/features/jobInfos/components/JobInfoForm";
import { getJobInfoUserTag } from "@/features/jobInfos/dbCache";
import { formatExperienceLevel } from "@/features/jobInfos/lib/formatters";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { desc, eq } from "drizzle-orm";
import { ArrowRightIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="size-24 animate-spin" />
        </div>
      }
    >
      <JobInfos />
    </Suspense>
  );
}

async function JobInfos() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const jobInfos = await getJobInfos(userId);

  if (jobInfos.length === 0) {
    return <NoJobInfos />;
  }

  return (
    <div className="container my-4">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:gap-2 sm:justify-between sm:items-center">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 has-hover:*:not-hover:opacity-70">
        {jobInfos.map((jobInfo) => (
          <Link
            className="hover:scale-[1.02] transition-[transform_opacity]"
            href={`/app/job-infos/${jobInfo.id}`}
            key={jobInfo.id}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-4 h-full flex-1 min-w-0">
                  <CardHeader>
                    <CardTitle className="text-lg">{jobInfo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground line-clamp-3">
                    {jobInfo.description}
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex-shrink-0">
                      {formatExperienceLevel(jobInfo.experienceLevel)}
                    </Badge>
                    {jobInfo.title && (
                      <Badge variant="outline" className="flex-shrink-0">
                        {jobInfo.title}
                      </Badge>
                    )}
                  </CardFooter>
                </div>
                <CardContent className="flex-shrink-0">
                  <ArrowRightIcon className="size-6" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
        <Link className="transition-opacity" href="/app/job-infos/new">
          <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
            <div className="text-lg flex items-center gap-2">
              <PlusIcon className="size-6" />
              New Job Description
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container my-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
        Welcome to Darasa
      </h1>
      <p className="text-muted-foreground mb-8">
        To get started, enter information about the type of job you are wanting
        to apply for. This can be specific information copied directly from a
        job listing or general information such as the tech stack you want to
        work in. The more specific you are in the description the closer the
        test interviews will be to the real thing.
      </p>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}

async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoUserTag(userId));

  return db.query.JobInfoTable.findMany({
    where: eq(JobInfoTable.userId, userId),
    orderBy: desc(JobInfoTable.updatedAt),
  });
}
