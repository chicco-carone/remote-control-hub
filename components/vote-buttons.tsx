"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import type { ConvexRemoteCode } from "@/types/convex";
import { useMutation } from "convex/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface VoteButtonsProps {
  code: ConvexRemoteCode;
  deviceId: Id<"devices">;
  size?: "sm" | "md";
}

export function VoteButtons({
  code,
  deviceId,
  size = "sm",
}: VoteButtonsProps) {
  const { isAuthenticated } = useCurrentUser();
  const [isVoting, setIsVoting] = useState(false);

  const voteOnCode = useMutation(api.mutations.votes.voteOnCode);

  const handleVote = async (type: "up" | "down") => {
    if (isVoting || !isAuthenticated) return;

    setIsVoting(true);

    try {
      await voteOnCode({
        codeId: code.id,
        deviceId: deviceId,
        type,
      });
      // Convex's reactive queries will automatically update the UI
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const buttonSize = size === "sm" ? "h-7 px-2" : "h-8 px-3";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const upVoteButton = (
    <Button
      variant={code.userVote === "up" ? "default" : "outline"}
      size="sm"
      className={cn(
        buttonSize,
        "gap-1 transition-all duration-200",
        code.userVote === "up" && "bg-green-600 hover:bg-green-700 text-white",
        isVoting && "opacity-50 cursor-not-allowed",
      )}
      onClick={() => handleVote("up")}
      disabled={isVoting || !isAuthenticated}
    >
      <ThumbsUp className={iconSize} />
      <span className={textSize}>{code.votes.thumbsUp}</span>
    </Button>
  );

  const downVoteButton = (
    <Button
      variant={code.userVote === "down" ? "default" : "outline"}
      size="sm"
      className={cn(
        buttonSize,
        "gap-1 transition-all duration-200",
        code.userVote === "down" && "bg-red-600 hover:bg-red-700 text-white",
        isVoting && "opacity-50 cursor-not-allowed",
      )}
      onClick={() => handleVote("down")}
      disabled={isVoting || !isAuthenticated}
    >
      <ThumbsDown className={iconSize} />
      <span className={textSize}>{code.votes.thumbsDown}</span>
    </Button>
  );

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {isAuthenticated ? (
          <>
            {upVoteButton}
            {downVoteButton}
          </>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>{upVoteButton}</TooltipTrigger>
              <TooltipContent>Authentication required for voting on content</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>{downVoteButton}</TooltipTrigger>
              <TooltipContent>Authentication required for voting on content</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
