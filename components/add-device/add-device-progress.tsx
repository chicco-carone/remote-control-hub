"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AddDeviceProgressProps {
  currentStep: number;
  getStepProgress: () => number;
  getCompletionPercentage: () => number;
}

export function AddDeviceProgress({
  currentStep,
  getStepProgress,
  getCompletionPercentage,
}: AddDeviceProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Badge variant={currentStep >= 1 ? "default" : "secondary"}>1</Badge>
          <span
            className={`text-sm ${currentStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}
          >
            Device & Protocol
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={currentStep >= 2 ? "default" : "secondary"}>2</Badge>
          <span
            className={`text-sm ${currentStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}
          >
            Remote Codes
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={currentStep >= 3 ? "default" : "secondary"}>3</Badge>
          <span
            className={`text-sm ${currentStep >= 3 ? "text-foreground" : "text-muted-foreground"}`}
          >
            Complete
          </span>
        </div>
      </div>
      <Progress value={getStepProgress()} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>Step {currentStep} of 3</span>
        <span>{getCompletionPercentage()}% complete</span>
      </div>
    </div>
  );
}
