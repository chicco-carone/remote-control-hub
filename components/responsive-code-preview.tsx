"use client";

import {
  ESPHomeHighlighter,
  JSONHighlighter,
} from "@/components/syntax-highlighter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Copy, Download, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

interface ResponsiveCodePreviewProps {
  code: string;
  format: "esphome" | "json";
  onCopy: () => void;
  onDownload: () => void;
  copied: boolean;
  fileName: string;
}

export function ResponsiveCodePreview({
  code,
  format,
  onCopy,
  onDownload,
  copied,
  fileName,
}: ResponsiveCodePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getFileExtension = () => (format === "json" ? "JSON" : "YAML");

  const CodeComponent =
    format === "esphome" ? ESPHomeHighlighter : JSONHighlighter;

  const PreviewContent = ({
    isFullscreenView = false,
  }: {
    isFullscreenView?: boolean;
  }) => (
    <Card
      className={`flex-1 overflow-hidden ${isFullscreenView ? "border-0 shadow-none" : ""}`}
    >
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={isFullscreenView ? "text-lg" : ""}>
              Preview ({getFileExtension()})
            </span>
            <Badge variant="outline" className="text-xs">
              {format === "esphome" ? "ESPHome YAML" : "JSON"}
            </Badge>
          </div>
          <div className="flex gap-2">
            {!isFullscreenView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(true)}
                className="hidden sm:flex"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="hidden sm:inline ml-2">Copy</span>
            </Button>
            <Button onClick={onDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <div
          className={`w-full border rounded-md bg-muted/20 overflow-hidden ${isFullscreenView ? "h-[calc(70vh-120px)]" : "h-96"}`}
        >
          <ScrollArea className="h-full w-full">
            <div className="p-4">
              <CodeComponent
                code={code}
                showLineNumbers={true}
                className="w-full"
              />
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <PreviewContent />

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                Code Preview - {getFileExtension()}
              </h2>
              <Badge variant="outline">
                {format === "esphome" ? "ESPHome YAML" : "JSON"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button onClick={onDownload} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(false)}
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            <div className="h-full w-full border rounded-md bg-muted/20 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-4">
                  <CodeComponent
                    code={code}
                    showLineNumbers={true}
                    className="w-full"
                  />
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground shrink-0">
            <span className="font-mono">{fileName}</span> •{" "}
            {new Blob([code]).size} bytes
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
