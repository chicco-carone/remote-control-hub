// components/device/export-info-card.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Download, FileDown, FileText } from "lucide-react";

interface ExportInfoCardProps {
  codeCount: number;
  deviceType: string;
  manufacturer: string;
  onOpenModal: () => void;
}

export function ExportInfoCard({
  codeCount,
  deviceType,
  manufacturer,
  onOpenModal,
}: ExportInfoCardProps) {
  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-green-600" />
          Export Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These remote control codes can be exported in multiple formats for
            use in ESPHome or as structured data backup.
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-green-200 dark:border-green-800 min-w-[140px] flex-1 max-w-[180px]">
              <Code className="h-5 w-5 text-green-600 mb-2" />
              <p className="text-sm font-medium text-center">ESPHome YAML</p>
              <p className="text-xs text-muted-foreground text-center">
                Ready-to-use configuration
              </p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-green-200 dark:border-green-800 min-w-[140px] flex-1 max-w-[180px]">
              <Code className="h-5 w-5 text-green-600 mb-2" />
              <p className="text-sm font-medium text-center">ESPHome Sub-Devices</p>
              <p className="text-xs text-muted-foreground text-center">
                With device grouping
              </p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-green-200 dark:border-green-800 min-w-[140px] flex-1 max-w-[180px] md:max-w-none">
              <FileText className="h-5 w-5 text-green-600 mb-2" />
              <p className="text-sm font-medium text-center">JSON Format</p>
              <p className="text-xs text-muted-foreground text-center">
                Structured backup
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <div>
              <p className="text-sm font-medium">{codeCount} codes available</p>
              <p className="text-xs text-muted-foreground">
                {deviceType} • {manufacturer}
              </p>
            </div>
            <Button
              onClick={onOpenModal}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              size="sm"
            >
              <FileDown className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View & Export All</span>
              <span className="sm:hidden">Export All</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
