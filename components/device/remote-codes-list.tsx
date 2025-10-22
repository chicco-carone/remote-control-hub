// components/device/remote-codes-list.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserDisplay } from "@/components/user-display";
import { VoteButtons } from "@/components/vote-buttons";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { ConvexRemoteCode } from "@/types/convex";
import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface RemoteCodesListProps {
  codes: ConvexRemoteCode[];
  deviceId: Id<"devices">;
  copiedCode: string | null;
  onCopy: (code: string, codeName: string) => void;
}

export function RemoteCodesList({
  codes,
  deviceId,
  copiedCode,
  onCopy,
}: RemoteCodesListProps) {
  const { isAuthenticated } = useCurrentUser();
  const [isBatchVoting, setIsBatchVoting] = useState(false);

  const voteOnAllCodes = useMutation(api.mutations.votes.voteOnAllCodes);

  const handleBatchVote = async (type: "up" | "down") => {
    if (isBatchVoting || !isAuthenticated) return;

    setIsBatchVoting(true);
    try {
      await voteOnAllCodes({
        deviceId,
        type,
      });
      // Convex's reactive queries will automatically update the UI
    } catch (error) {
      console.error("Failed to batch vote:", error);
    } finally {
      setIsBatchVoting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Remote Control Codes
          {isAuthenticated && codes.length > 1 && (
            <TooltipProvider>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rate all:</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchVote("up")}
                      disabled={isBatchVoting}
                      className="h-8 gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs">All</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Rate all codes as helpful
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchVote("down")}
                      disabled={isBatchVoting}
                      className="h-8 gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span className="text-xs">All</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Rate all codes as not helpful
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {codes.map((code, index) => (
            <div key={code.id}>
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border/50 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-foreground">
                        {code.name}
                      </h3>
                      {code.uploadedBy !== undefined && (
                        <UserDisplay userName={code.uploadedBy} size="sm" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded border">
                        {code.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(code.code, code.name)}
                        className="h-8 px-2"
                      >
                        {copiedCode === code.name ? (
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Added{" "}
                      {formatDistanceToNow(new Date(code.uploadedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <VoteButtons
                    code={code}
                    deviceId={deviceId}
                  />
                  <div className="text-xs text-muted-foreground">
                    {code.votes.thumbsUp + code.votes.thumbsDown > 0 && (
                      <span>
                        {Math.round(
                          (code.votes.thumbsUp /
                            (code.votes.thumbsUp + code.votes.thumbsDown)) *
                            100,
                        )}
                        % helpful
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {index < codes.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
