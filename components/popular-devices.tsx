"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDisplay } from "@/components/user-display";
import type { ConvexDevice } from "@/types/convex";
import { ChevronRight, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface PopularDevicesProps {
  devices: ConvexDevice[];
}

export function PopularDevices({ devices }: PopularDevicesProps) {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => {
        const totalVotes =
          device.totalVotes.thumbsUp + device.totalVotes.thumbsDown;
        const effectiveness =
          totalVotes > 0
            ? Math.round((device.totalVotes.thumbsUp / totalVotes) * 100)
            : 0;

        return (
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
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:shadow-primary/5 dark:hover:shadow-primary/10 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors truncate">
                      {device.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {device.manufacturer}
                    </p>
                    {device.model && (
                      <p className="text-xs text-muted-foreground">
                        Model: {device.model}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">{device.deviceType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      {device.totalVotes.thumbsUp}
                    </span>
                    <span className="text-xs text-muted-foreground">votes</span>
                  </div>
                  <Badge
                    variant={effectiveness >= 80 ? "default" : "secondary"}
                  >
                    {effectiveness}% effective
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {device.codes.length} codes available
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <UserDisplay
                    userName={device.uploadedBy}
                    userImage={device.uploadedByImage}
                    showName
                    size="sm"
                  />
                  <span className="text-xs text-muted-foreground">
                    Contributor
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
