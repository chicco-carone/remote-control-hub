"use client";

import { ExportCodesDialog } from "@/components/add-device/export-codes-dialog";
import { ButtonIcon } from "@/components/button-icon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { protocolParameters } from "@/lib/esphome-constants";
import { ProtocolParameter } from "@/types/constants";
import { CodesRecapCardProps, EditingCode } from "@/types/form";
import {
  AlertTriangle,
  CheckCircle,
  Code,
  Download,
  Edit2,
  FileDown,
  Save,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function CodesRecapCard({
  codes,
  deviceType,
  protocol,
  deviceName,
  manufacturer,
  model,
  onCodesUpdate,
  onProceed,
  onGoBack,
}: CodesRecapCardProps) {
  const [editingCode, setEditingCode] = useState<EditingCode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleEditCode = (index: number) => {
    setEditingCode({
      ...codes[index],
      originalIndex: index,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingCode) return;

    const updatedCodes = [...codes];
    updatedCodes[editingCode.originalIndex] = {
      name: editingCode.name,
      protocol: editingCode.protocol,
      parameters: editingCode.parameters,
    };

    onCodesUpdate(updatedCodes);
    setEditingCode(null);
    setIsEditDialogOpen(false);
  };

  const handleRemoveCode = (index: number) => {
    const updatedCodes = codes.filter((_, i) => i !== index);
    onCodesUpdate(updatedCodes);
  };

  const handleParameterChange = (
    paramName: string,
    value: string | number | boolean,
  ) => {
    if (!editingCode) return;

    setEditingCode({
      ...editingCode,
      parameters: {
        ...editingCode.parameters,
        [paramName]: value,
      },
    });
  };

  const getButtonIcon = (buttonName: string): string => {
    // Map common button names to icons
    const iconMap: Record<string, string> = {
      power: "power",
      "volume up": "volume-2",
      "volume down": "volume-1",
      mute: "volume-x",
      "channel up": "chevron-up",
      "channel down": "chevron-down",
      menu: "menu",
      home: "home",
      back: "arrow-left",
      ok: "check",
      enter: "check",
      up: "arrow-up",
      down: "arrow-down",
      left: "arrow-left",
      right: "arrow-right",
      input: "monitor",
      source: "monitor",
      "temperature up": "thermometer",
      "temperature down": "thermometer",
      mode: "settings",
      "fan speed": "fan",
      timer: "clock",
      swing: "move",
      sleep: "moon",
      "bass up": "plus",
      "bass down": "minus",
      "treble up": "plus",
      "treble down": "minus",
    };

    const key = buttonName.toLowerCase();
    return iconMap[key] || "circle";
  };

  const renderParameterInput = (param: ProtocolParameter) => {
    if (!editingCode) return null;

    const value = editingCode.parameters[param.name] || "";

    if (param.type === "boolean") {
      return (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`param-${param.name}`}
            checked={value === "true"}
            onChange={(e) =>
              handleParameterChange(
                param.name,
                e.target.checked ? "true" : "false",
              )
            }
            className="rounded border-gray-300"
          />
          <Label htmlFor={`param-${param.name}`} className="text-sm">
            {param.label}
          </Label>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={`param-${param.name}`}>
          {param.label}{" "}
          {param.required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id={`param-${param.name}`}
          value={value}
          onChange={(e) => handleParameterChange(param.name, e.target.value)}
          placeholder={param.placeholder}
          className={
            param.type === "bytes" || param.type === "list"
              ? "font-mono text-sm"
              : ""
          }
        />
        {param.description && (
          <p className="text-xs text-muted-foreground">{param.description}</p>
        )}
      </div>
    );
  };

  const protocolParams = protocolParameters[protocol] || [];

  return (
    <div className="space-y-6">
      {/* Enhanced Summary Header with Export */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle>Device Codes Ready for Export</CardTitle>
              <Badge variant="secondary">{codes.length} codes captured</Badge>
            </div>
            {/* Prominent Export Button */}
            <Button
              onClick={() => setIsExportDialogOpen(true)}
              disabled={codes.length === 0}
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
              <p className="font-medium">{codes.length}</p>
            </div>
          </div>

          {/* Export Quick Actions */}
          <div className="mt-4 p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Ready to Export
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Export as ESPHome YAML or JSON format for immediate use
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExportDialogOpen(true)}
                  className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950/30"
                >
                  <Download className="mr-1 h-3 w-3" />
                  Quick Export
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Codes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Captured Remote Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No codes have been captured yet. Please go back and capture some
                codes first.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {codes.map((code, index) => {
                const buttonIcon = getButtonIcon(code.name);

                return (
                  <Card key={index} className="border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Button Info */}
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <ButtonIcon
                                name={buttonIcon}
                                className="h-4 w-4 text-primary"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{code.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {protocol.toUpperCase()} Protocol
                              </p>
                            </div>
                          </div>

                          {/* Code Display */}
                          <div className="bg-muted/50 rounded-lg p-3 border text-xs text-muted-foreground">
                            ESPHome YAML is available in the Export dialog.
                          </div>

                          {/* Parameters Summary */}
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(code.parameters)
                              .filter(([key]) => {
                                const paramMeta = (
                                  protocolParameters[code.protocol] || []
                                ).find((p) => p.name === key);
                                return !(paramMeta && paramMeta.skip);
                              })
                              .map(([key, value]) => (
                                <Badge
                                  key={key}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {key}:{" "}
                                  {typeof value === "string" &&
                                  value.startsWith("0x")
                                    ? value
                                    : typeof value === "number"
                                      ? `0x${value.toString(16).toUpperCase()}`
                                      : String(value)}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCode(index)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCode(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onGoBack}>
          Go Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onProceed} disabled={codes.length === 0} size="lg">
            <Zap className="mr-2 h-4 w-4" />
            Save Device ({codes.length} codes)
          </Button>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportCodesDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        codes={codes}
        deviceName={deviceName}
        deviceType={deviceType}
        manufacturer={manufacturer}
        model={model}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5" />
              Edit Code: {editingCode?.name}
            </DialogTitle>
          </DialogHeader>

          {editingCode && (
            <div className="space-y-6">
              {/* Button Name */}
              <div className="space-y-2">
                <Label htmlFor="button-name">
                  Button Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="button-name"
                  value={editingCode.name}
                  onChange={(e) =>
                    setEditingCode({ ...editingCode, name: e.target.value })
                  }
                  placeholder="e.g., Power On/Off"
                />
              </div>

              {/* Protocol Parameters */}
              <div className="space-y-4">
                <h4 className="font-medium">Protocol Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {protocolParams.map((param) => (
                    <div key={param.name}>{renderParameterInput(param)}</div>
                  ))}
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={!editingCode.name.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
