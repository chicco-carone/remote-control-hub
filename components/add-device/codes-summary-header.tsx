"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";

interface CodesSummaryHeaderProps {
  codesCount: number;
  deviceName: string;
  manufacturer: string;
  protocol: string;
  onExport: () => void;
}

export function CodesSummaryHeader({
  codesCount,
  deviceName,
  manufacturer,
  protocol,
  onExport,
}: CodesSummaryHeaderProps) {
  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Device Codes Ready for Export</CardTitle>
            <Badge variant="secondary">{codesCount} codes captured</Badge>
          </div>
          <Button
            onClick={onExport}
            disabled={codesCount === 0}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export Codes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Device:</span>
            <p className="font-medium">{deviceName}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Brand:</span>
            <p className="font-medium">{manufacturer}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Protocol:</span>
            <p className="font-medium">{protocol.toUpperCase()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Total Codes:</span>
            <p className="font-medium">{codesCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
