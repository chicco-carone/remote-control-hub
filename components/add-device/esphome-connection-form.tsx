"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ESPHomeDevice } from "@/types/esphome";
import { ESPHomeConnectionFormProps } from "@/types/form";
import { AlertCircle, CheckCircle, Loader2, Wifi } from "lucide-react";
import { useState } from "react";

export function ESPHomeConnectionForm({
  onConnect,
  isConnecting,
  connectionError,
  isConnected,
}: ESPHomeConnectionFormProps) {
  const { isAuthenticated } = useCurrentUser();
  const [device, setDevice] = useState<ESPHomeDevice>({
    ip: "",
    password: "",
    encryptionKey: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (device.ip.trim()) {
      onConnect(device);
    }
  };

  const handleInputChange = (field: keyof ESPHomeDevice, value: string) => {
    setDevice((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connect to ESPHome Device
            {isConnected && (
              <Badge variant="default" className="ml-2">
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ip">
                Device IP Address <span className="text-red-500">*</span>
              </Label>
              {!isAuthenticated ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="ip"
                      type="text"
                      value={device.ip}
                      onChange={(e) => handleInputChange("ip", e.target.value)}
                      placeholder="192.168.1.100"
                      disabled
                      required
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    Authentication required to add devices
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Input
                  id="ip"
                  type="text"
                  value={device.ip}
                  onChange={(e) => handleInputChange("ip", e.target.value)}
                  placeholder="192.168.1.100"
                  disabled={isConnecting || isConnected}
                  required
                />
              )}
            </div>

            {connectionError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}

            {isConnected && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully connected to ESPHome device at {device.ip}
                </AlertDescription>
              </Alert>
            )}

            {!isAuthenticated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" disabled className="w-full">
                    <Wifi className="mr-2 h-4 w-4" />
                    Connect to Device
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Authentication required to add devices
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                type="submit"
                disabled={isConnecting || isConnected || !device.ip.trim()}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <Wifi className="mr-2 h-4 w-4" />
                    Connect to Device
                  </>
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
