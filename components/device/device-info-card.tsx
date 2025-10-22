// components/device/device-info-card.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Flag, User } from "lucide-react";

interface DeviceInfoCardProps {
  deviceType: string;
  effectiveness: number;
  uploadedAt: string | number | Date;
  codeCount: number;
  notes?: string;
}

export function DeviceInfoCard({
  deviceType,
  effectiveness,
  uploadedAt,
  codeCount,
  notes,
}: DeviceInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{deviceType}</Badge>
              {effectiveness > 0 && (
                <Badge variant={effectiveness >= 80 ? "default" : "secondary"}>
                  {effectiveness}% effective
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Added{" "}
                  {formatDistanceToNow(new Date(uploadedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{codeCount} codes</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {notes && (
        <CardContent>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-l-4 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Notes:</strong> {notes}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
