import { ComponentProps } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

export function UserAvatar({
  user,
  ...props
}: {
  user: { name: string; imageUrl: string | null };
} & ComponentProps<typeof Avatar>) {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.imageUrl || undefined} alt={user.name} />
      <AvatarFallback className="uppercase">
        {user.name
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
}
