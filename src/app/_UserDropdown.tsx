"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import { User, LogOut } from "lucide-react";
import { UserAvatar } from "@/features/users/components/UserAvatar";

export function UserDropdown({
  user,
}: {
  user: { name: string; imageUrl: string | null };
}) {
  const { openUserProfile } = useClerk();

  return (
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
  );
}
