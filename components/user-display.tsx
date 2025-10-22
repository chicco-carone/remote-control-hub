"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";

interface UserDisplayProps {
  userId?: Id<"users">;
  userName?: string;
  userImage?: string;
  showName?: boolean;
  showReputation?: boolean;
  showTooltip?: boolean;
  size?: "sm" | "md" | "lg";
  uploadedAt?: string;
}

export function UserDisplay({
  userId,
  userName,
  userImage,
  showName = false,
  showReputation = false,
  showTooltip = true,
  size = "sm",
  uploadedAt,
}: UserDisplayProps) {
  // Only fetch user data if we have a userId
  const user = useQuery(
    api.queries.getUserById,
    userId ? { id: userId } : "skip",
  );
  const { user: clerkUser } = useUser();

  // Use provided userName if no userId or user data
  const displayName = user?.name || userName || "Unknown User";
  // Use provided userImage, fallback to Convex user image, fallback to Clerk user image
  const avatarImage =
    userImage || user?.avatar || user?.image || clerkUser?.imageUrl;

  const avatarSize =
    size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const content = (
    <div className="flex items-center gap-2 min-w-0">
      <Avatar className={avatarSize}>
        <AvatarImage
          src={avatarImage || "/placeholder.svg"}
          alt={displayName}
        />
        <AvatarFallback className={textSize}>
          {displayName
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <div className="flex flex-col min-w-0">
          <span className={`font-medium ${textSize} truncate`}>
            {displayName}
          </span>
          {showReputation && user && (
            <span className="text-xs text-muted-foreground truncate">
              Role: {user.role || "user"}
            </span>
          )}
          {uploadedAt && (
            <span className="text-xs text-muted-foreground truncate">
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
                  src={avatarImage || "/placeholder.svg"}
                  alt={displayName}
                />
                <AvatarFallback className="text-xs">
                  {displayName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{displayName}</p>
                {user && (
                  <p className="text-xs text-muted-foreground">
                    @{user.username || "user"}
                  </p>
                )}
              </div>
            </div>
            {user?.createdAt && (
              <p className="text-xs text-muted-foreground">
                Joined{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </p>
            )}
            {!user && userName && (
              <p className="text-xs text-muted-foreground">
                Contributor: {userName}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
