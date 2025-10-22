// components/device/device-sidebar.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDisplay } from "@/components/user-display";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface DeviceSidebarProps {
  uploadedBy: string;
  uploadedByImage: string;
  codeCount: number;
  totalVotes: { thumbsUp: number; thumbsDown: number };
  effectiveness: number;
}

export function DeviceSidebar({
  uploadedBy,
  uploadedByImage,
  codeCount,
  totalVotes,
  effectiveness,
}: DeviceSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Contributor Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contributor</CardTitle>
        </CardHeader>
        <CardContent>
          <UserDisplay
            userName={uploadedBy}
            userImage={uploadedByImage}
            showName
            showReputation
            size="md"
          />
        </CardContent>
      </Card>

      {/* Device Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Codes</span>
            <Badge variant="secondary">{codeCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Helpful Votes</span>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">{totalVotes.thumbsUp}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Not Helpful</span>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">
                {totalVotes.thumbsDown}
              </span>
            </div>
          </div>
          {effectiveness > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Effectiveness
              </span>
              <Badge variant={effectiveness >= 80 ? "default" : "secondary"}>
                {effectiveness}%
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Devices - TODO: Implement with Convex query */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Related devices will be shown here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
