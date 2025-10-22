"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDisplay } from "@/components/user-display";
import type { ConvexDevice } from "@/types/convex";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecentContributionsProps {
  devices: ConvexDevice[];
}

export function RecentContributions({ devices }: RecentContributionsProps) {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {devices.map((device) => (
        <div
          key={device.id}
          onClick={() => router.push(`/device/${device.id}`)}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") router.push(`/device/${device.id}`);
          }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 hover:shadow-primary/5 dark:hover:shadow-primary/10 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                    {device.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {device.manufacturer}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{device.deviceType}</Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Added{" "}
                  {formatDistanceToNow(new Date(device.uploadedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground truncate flex-1 min-w-0">
                  {device.codes.length} remote codes
                </span>
                <div className="min-w-0 shrink">
                  <UserDisplay
                    userName={device.uploadedBy}
                    userImage={device.uploadedByImage}
                    showName
                    size="sm"
                  />
                </div>
              </div>

              {device.notes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {device.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
