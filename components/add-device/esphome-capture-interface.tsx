"use client";

import { CodesRecapCard } from "@/components/add-device/codes-recap-card";
import { ButtonIcon } from "@/components/button-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDeviceButtons } from "@/lib/device-buttons";
import { esphomeAPI } from "@/lib/esphome-api";
import {
  CapturedButtonCode,
  CapturedCode,
  ESPHomeConnection,
  ESPHomeLogEntry,
} from "@/types/esphome";
import { DeviceButton } from "@/types/types";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ESPHomeCaptureInterfaceProps {
  connection: ESPHomeConnection;
  protocol: string;
  deviceType: string;
  deviceName: string;
  manufacturer: string;
  model?: string;
  onCodesReady: (codes: CapturedButtonCode[]) => void;
}

export function ESPHomeCaptureInterface({
  connection,
  protocol,
  deviceType,
  deviceName,
  manufacturer,
  model,
  onCodesReady,
}: ESPHomeCaptureInterfaceProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
  const [capturedCodes, setCapturedCodes] = useState<CapturedButtonCode[]>([]);
  const [customButtons, setCustomButtons] = useState<DeviceButton[]>([]);
  const [newButtonName, setNewButtonName] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [showRecap, setShowRecap] = useState(false);

  const defaultButtons = getDeviceButtons(deviceType);
  const allButtons = useMemo(
    () => [...defaultButtons, ...customButtons],
    [defaultButtons, customButtons],
  );

  useEffect(() => {
    // Initialize captured codes array
    const initialCodes = allButtons.map((button) => ({
      button,
      code: null as CapturedCode | null,
      captured: false,
    }));
    setCapturedCodes(initialCodes);
  }, [allButtons]);

  useEffect(() => {
    // Set up code capture callback
    connection.onCodeCaptured = (code: CapturedCode) => {
      if (isCapturing && currentButtonIndex < allButtons.length) {
        setCapturedCodes((prev) => {
          const updated = [...prev];
          updated[currentButtonIndex] = {
            ...updated[currentButtonIndex],
            code,
            captured: true,
          };
          return updated;
        });
        setIsCapturing(false);
      }
    };
    connection.onLogReceived = (log: ESPHomeLogEntry) => {
      connection.logs.push(log);
    };

    return () => {
      connection.onCodeCaptured = undefined;
      connection.onLogReceived = undefined;
    };
  }, [connection, isCapturing, currentButtonIndex, allButtons]);

  const handleStartCapture = async () => {
    setIsCapturing(true);
    await esphomeAPI.startCapture(connection.device.ip, protocol);
  };

  const handleRetryCapture = async () => {
    setCapturedCodes((prev) => {
      const updated = [...prev];
      updated[currentButtonIndex] = {
        ...updated[currentButtonIndex],
        captured: false,
        code: null as CapturedCode | null,
      };
      return updated;
    });
    await esphomeAPI.startCapture(connection.device.ip, protocol);
  };

  const handleNextButton = () => {
    if (currentButtonIndex < allButtons.length - 1) {
      setCurrentButtonIndex(currentButtonIndex + 1);
    }
  };

  const handlePreviousButton = () => {
    if (currentButtonIndex > 0) {
      setCurrentButtonIndex(currentButtonIndex - 1);
    }
  };

  const handleAddCustomButton = () => {
    if (newButtonName.trim()) {
      const newButton: DeviceButton = {
        name: newButtonName.trim(),
        description: `Custom button: ${newButtonName.trim()}`,
        icon: "circle",
        category: "custom",
      };
      setCustomButtons((prev) => [...prev, newButton]);
      setNewButtonName("");
      setIsAddingCustom(false);
    }
  };

  const handleShowRecap = () => {
    setShowRecap(true);
  };

  const handleGoBackToCapture = () => {
    setShowRecap(false);
  };

  const handleCodesUpdate = (
    updatedCodes: {
      name: string;
      parameters: Record<string, string | number | boolean>;
    }[],
  ) => {
    // Convert back to CapturedButtonCode format
    const updatedCapturedCodes = capturedCodes
      .map((item, index) => {
        const updatedCode = updatedCodes.find(
          (code, codeIndex) => codeIndex === index,
        );
        if (updatedCode) {
          return {
            ...item,
            code: {
              ...item.code!,
              parameters: updatedCode.parameters,
            },
            button: {
              ...item.button,
              name: updatedCode.name,
            },
          };
        }
        return item;
      })
      .filter((_, index) => index < updatedCodes.length);

    setCapturedCodes(updatedCapturedCodes);
  };

  const handleProceedWithCodes = () => {
    const completedCodes = capturedCodes.filter((item) => item.captured);
    onCodesReady(completedCodes);
  };

  const currentButton = allButtons[currentButtonIndex];
  const currentCaptured = capturedCodes[currentButtonIndex];
  const completedCount = capturedCodes.filter((item) => item.captured).length;
  const isComplete = completedCount > 0;

  // Convert captured codes to the format expected by CodesRecapCard
  const codesForRecap = capturedCodes
    .filter((item) => item.captured)
    .map((item) => ({
      name: item.button.name,
      protocol: protocol,
      parameters: item.code!.parameters,
    }));

  if (showRecap) {
    return (
      <CodesRecapCard
        codes={codesForRecap}
        deviceType={deviceType}
        protocol={protocol}
        deviceName={deviceName}
        manufacturer={manufacturer}
        model={model}
        onCodesUpdate={handleCodesUpdate}
        onProceed={handleProceedWithCodes}
        onGoBack={handleGoBackToCapture}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Capture Progress
            <Badge variant="secondary">
              {completedCount} of {allButtons.length} captured
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {allButtons.map((button, index) => {
              const captured = capturedCodes[index]?.captured;
              const isCurrent = index === currentButtonIndex;

              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : captured
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                        : "border-border bg-muted/30"
                  }`}
                  onClick={() => setCurrentButtonIndex(index)}
                >
                  <div className="flex items-center justify-center mb-1">
                    <ButtonIcon name={button.icon} className="h-4 w-4" />
                    {captured && (
                      <CheckCircle className="h-3 w-3 text-green-600 ml-1" />
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{button.name}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Button Capture */}
      {currentButton && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ButtonIcon name={currentButton.icon} className="h-5 w-5" />
              Capture: {currentButton.name}
              <Badge variant="outline">
                Step {currentButtonIndex + 1} of {allButtons.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                <strong>
                  Press the &quot;{currentButton.name}&quot; button on your
                  original remote control
                </strong>
                <br />
                {currentButton.description}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleStartCapture}
                disabled={isCapturing}
                size="lg"
                className="flex-1"
              >
                {isCapturing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Listening for IR signal...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Capture
                  </>
                )}
              </Button>

              {currentCaptured?.captured && (
                <Button
                  onClick={handleRetryCapture}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              )}
            </div>

            {currentCaptured?.captured && currentCaptured.code && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Code captured successfully!</strong>
                  <br />
                  Protocol: {currentCaptured.code.protocol.toUpperCase()}
                  <br />
                  Parameters: {JSON.stringify(currentCaptured.code.parameters)}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between">
              <Button
                onClick={handlePreviousButton}
                disabled={currentButtonIndex === 0}
                variant="outline"
              >
                Previous
              </Button>

              <Button
                onClick={handleNextButton}
                disabled={currentButtonIndex >= allButtons.length - 1}
                variant="outline"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Custom Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Custom Buttons
            {customButtons.length > 0 && (
              <Badge variant="secondary">{customButtons.length} added</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAddingCustom ? (
            <Button
              onClick={() => setIsAddingCustom(true)}
              variant="outline"
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Button
            </Button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newButtonName}
                onChange={(e) => setNewButtonName(e.target.value)}
                placeholder="Enter button name"
                className="flex-1 px-3 py-2 border rounded-md"
                onKeyPress={(e) => e.key === "Enter" && handleAddCustomButton()}
              />
              <Button
                onClick={handleAddCustomButton}
                disabled={!newButtonName.trim()}
              >
                Add
              </Button>
              <Button
                onClick={() => setIsAddingCustom(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          )}

          {customButtons.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {customButtons.map((button, index) => (
                <div
                  key={index}
                  className="p-2 rounded-lg border bg-blue-50 dark:bg-blue-950/30 text-center"
                >
                  <ButtonIcon
                    name={button.icon}
                    className="h-4 w-4 mx-auto mb-1"
                  />
                  <p className="text-xs font-medium truncate">{button.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ESPHome Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5" />
              ESPHome Logs
            </div>
            <Button
              onClick={() => setShowLogs(!showLogs)}
              variant="outline"
              size="sm"
            >
              {showLogs ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showLogs ? "Hide" : "Show"} Logs
            </Button>
          </CardTitle>
        </CardHeader>
        {showLogs && (
          <CardContent>
            <ScrollArea className="h-48 w-full border rounded-md p-3 bg-black text-green-400 font-mono text-sm">
              {connection.logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span
                    className={`ml-2 ${
                      log.level === "ERROR"
                        ? "text-red-400"
                        : log.level === "WARN"
                          ? "text-yellow-400"
                          : log.level === "INFO"
                            ? "text-blue-400"
                            : "text-green-400"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-cyan-400 ml-2">{log.component}:</span>
                  <span className="ml-2">{log.message}</span>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        )}
      </Card>

      {/* Review Codes Button */}
      {isComplete && (
        <div className="flex justify-end">
          <Button onClick={handleShowRecap} size="lg">
            <CheckCircle className="mr-2 h-4 w-4" />
            Review Captured Codes ({completedCount})
          </Button>
        </div>
      )}
    </div>
  );
}
