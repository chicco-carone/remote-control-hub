"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { FiSettings } from "react-icons/fi";
interface UserAvatarProps {
  showName?: boolean;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
  uploadedAt?: string;
}

export function UserAvatar({
  showName = false,
  showTooltip = true,
  size = "sm",
  uploadedAt,
}: UserAvatarProps) {
  const { user } = useCurrentUser();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Avatar
          className={
            size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10"
          }
        >
          <AvatarFallback className="text-xs">?</AvatarFallback>
        </Avatar>
        {showName && (
          <span className="text-sm text-muted-foreground">Unknown User</span>
        )}
      </div>
    );
  }

  const avatarSize =
    size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const content = (
    <div className="flex items-center gap-2">
      <Avatar className={avatarSize}>
        <AvatarImage
          src={user.image || "/placeholder.svg"}
          alt={user.name ?? ""}
        />
        <AvatarFallback className={textSize}>
          {(user.name ?? user.username)
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div className="flex flex-col">
          <span className={`font-medium ${textSize}`}>{user.name}</span>
          {uploadedAt && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(uploadedAt), { addSuffix: true })}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.image || "/placeholder.svg"}
                  alt={user.name ?? ""}
                />
                <AvatarFallback className="text-xs">
                  {(user.name ?? user.username)
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
              <div
                onClick={() => router.push("/profile-settings")}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push("/profile-settings");
                }}
              >
                <button
                  type="button"
                  aria-label="Open user settings"
                  className="ml-2 p-1 rounded hover:bg-muted transition"
                >
                  <FiSettings className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Joined{" "}
              {formatDistanceToNow(
                new Date(
                  (user as { _creationTime: number })._creationTime ?? 0,
                ),
                {
                  addSuffix: true,
                },
              )}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
