"use client";

import {
  BookOpenIcon,
  FileSlidersIcon,
  LogOut,
  Sparkles,
  SpeechIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Interviews", href: "interviews", Icon: SpeechIcon },
  { name: "Questions", href: "questions", Icon: BookOpenIcon },
  { name: "Resume", href: "resume", Icon: FileSlidersIcon },
];

export function Navbar({
  user,
  plan,
}: {
  user: { name: string; imageUrl: string | null };
  plan: "free" | "pro" | "max";
}) {
  const { openUserProfile } = useClerk();
  const { jobInfoId } = useParams();
  const pathName = usePathname();
  const label = plan === "max" ? "Max" : plan === "pro" ? "Pro" : "Free";
  const isPaid = plan === "pro" || plan === "max";
  const badgeClassName = cn(
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
    isPaid
      ? "border-cyan-200/40 bg-gradient-to-r from-primary via-cyan-500 to-cyan-400 text-white shadow-[0_0_18px_rgba(21,94,117,0.55)]"
      : "border-border bg-muted text-muted-foreground shadow-sm"
  );

  return (
    <nav className="h-header border-b">
      <div className="container flex h-full items-center justify-between">
        <Link href="/app" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Darasa Logo"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="text-xl font-bold">Darasa</span>
        </Link>

        <div className="flex items-center gap-4">
          <span
            className={badgeClassName}
            aria-label={`Current plan: ${label}`}
          >
            {isPaid && <Sparkles className="size-4 drop-shadow" />}
            {label}
          </span>

          {typeof jobInfoId === "string" &&
            navLinks.map(({ name, href, Icon }) => {
              const hrefPath = `/app/job-infos/${jobInfoId}/${href}`;

              return (
                <Button
                  variant={pathName === hrefPath ? "secondary" : "ghost"}
                  key={name}
                  asChild
                  className="cursor-pointer max-sm:hidden"
                >
                  <Link href={hrefPath}>
                    <Icon />
                    {name}
                  </Link>
                </Button>
              );
            })}

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => openUserProfile()}>
                <User className="mr-2" />
                Profile
              </DropdownMenuItem>
              <SignOutButton>
                <DropdownMenuItem>
                  <LogOut className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
