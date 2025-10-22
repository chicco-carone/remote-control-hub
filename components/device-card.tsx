"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDisplay } from "@/components/user-display";
import type { Device } from "@/types/types";
import { Code, User, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeviceCardProps {
  device: Device;
  onDeviceUpdate?: (device: Device) => void;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const router = useRouter();

  const effectiveness =
    device.totalVotes.thumbsUp + device.totalVotes.thumbsDown > 0
      ? Math.round(
          (device.totalVotes.thumbsUp /
            (device.totalVotes.thumbsUp + device.totalVotes.thumbsDown)) *
            100,
        )
      : 0;

  return (
    <Card className="h-fit hover:shadow-lg transition-all duration-300 hover:shadow-primary/5 dark:hover:shadow-primary/10 bg-card border-border group">
      <CardHeader className="pb-3 md:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div className="space-y-1">
            <div
              onClick={() => router.push(`/device/${device.id}`)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/device/${device.id}`);
              }}
            >
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {device.name}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {device.manufacturer}
            </p>
            {device.model && (
              <p className="text-xs text-muted-foreground hidden md:block">
                Model: {device.model}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline">{device.deviceType}</Badge>
            {device.totalVotes.thumbsUp +
              device.totalVotes.thumbsDown >
              0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground hidden md:flex">
                <TrendingUp className="h-3 w-3" />
                <span>{effectiveness}% effective</span>
              </div>
            )}
          </div>
        </div>

        {/* Device uploader info */}
        <div className="flex items-center pt-1 border-t border-border/50">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="hidden md:block">
              <UserDisplay
                userName={device.uploadedBy}
                userImage={device.uploadedByImage}
                showName
                uploadedAt={device.uploadedAt}
                size="sm"
              />
            </div>
            <div className="md:hidden">
              <UserDisplay
                userName={device.uploadedBy}
                userImage={device.uploadedByImage}
                showName
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3 md:pt-6 pb-3 md:pb-6">
        {/* Codes summary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 md:mb-4">
          <Code className="h-4 w-4" />
          <span>{device.codes.length} codes available</span>
        </div>

        {device.notes && (
          <div className="hidden md:block mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-200 dark:border-blue-800 transition-colors duration-200">
            <p className="text-sm text-blue-800 dark:text-blue-200 break-words">
              <strong>Notes:</strong> {device.notes}
            </p>
          </div>
        )}

        {/* View Details Link */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div
            onClick={() => router.push(`/device/${device.id}`)}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/device/${device.id}`);
            }}
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
            >
              <span className="hidden md:inline">View Full Details & Export Codes</span>
              <span className="md:hidden">View & Export</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
