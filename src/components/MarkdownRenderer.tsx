import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import Markdown from "react-markdown";

export function MarkdownRenderer({
  className,
  ...props
}: { className?: string } & ComponentProps<typeof Markdown>) {
  return (
    <div
      className={cn(
        // Use scoped Tailwind Typography class defined via plugin options in globals.css
        "max-w-none markdown font-sans dark:markdown-invert",
        className
      )}
    >
      <Markdown {...props} />
    </div>
  );
}
