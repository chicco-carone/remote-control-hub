"use client";

import { ResponsiveCodePreview } from "@/components/responsive-code-preview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CodePreviewFormat,
  ESPHomeCode,
  ExportCodesDialogProps,
  ExportFormat,
} from "@/types/form";
import { Code, Download, FileText, Info } from "lucide-react";
import { useEffect, useState } from "react";

export function ExportCodesDialog({
  isOpen,
  onClose,
  codes,
  deviceName,
  deviceType,
  manufacturer,
  model,
  initialFormat = "esphome",
}: ExportCodesDialogProps & { initialFormat?: ExportFormat }) {
  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>(initialFormat);

  // Update selected format when initialFormat changes
  useEffect(() => {
    setSelectedFormat(initialFormat);
  }, [initialFormat]);
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);

  const getPreviewFormat = (format: ExportFormat): CodePreviewFormat => {
    return format === "json" ? "json" : "esphome";
  };

  const generateJSONExport = (): string => {
    const exportData = {
      device: {
        name: deviceName,
        manufacturer: manufacturer,
        model: model || null,
        deviceType: deviceType,
      },
      exportInfo: {
        exportedAt: new Date().toISOString(),
        totalCodes: codes.length,
        format: "Remote Control Hub JSON Export v1.0",
      },
      codes: codes.map((code, index) => ({
        id: index + 1,
        buttonName: code.name,
        protocol: code.protocol,
        parameters: code.parameters,
        esphomeCode: generateESPHomeCodeBlock(code),
      })),
    };

    return JSON.stringify(exportData, null, 2);
  };

  const generateESPHomeCodeBlock = (code: ESPHomeCode): string => {
    const protocolName = code.protocol.toLowerCase();
    let codeBlock = `      - remote_transmitter.transmit_${protocolName}:\n`;

    // Protocol-specific parameter handling
    switch (protocolName) {
      case "nec":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        if (code.parameters.command_repeats !== undefined) {
          codeBlock += `          command_repeats: ${code.parameters.command_repeats}\n`;
        }
        break;

      case "samsung":
        if (code.parameters.data !== undefined) {
          codeBlock += `          data: ${code.parameters.data}\n`;
        }
        if (code.parameters.nbits !== undefined) {
          codeBlock += `          nbits: ${code.parameters.nbits}\n`;
        }
        break;

      case "samsung36":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        break;

      case "sony":
        if (code.parameters.data !== undefined) {
          codeBlock += `          data: ${code.parameters.data}\n`;
        }
        if (code.parameters.nbits !== undefined) {
          codeBlock += `          nbits: ${code.parameters.nbits}\n`;
        }
        break;

      case "lg":
        if (code.parameters.data !== undefined) {
          codeBlock += `          data: ${code.parameters.data}\n`;
        }
        if (code.parameters.nbits !== undefined) {
          codeBlock += `          nbits: ${code.parameters.nbits}\n`;
        }
        break;

      case "panasonic":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        break;

      case "jvc":
        if (code.parameters.data !== undefined) {
          codeBlock += `          data: ${code.parameters.data}\n`;
        }
        break;

      case "rc5":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        break;

      case "rc6":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        break;

      case "pioneer":
        if (code.parameters.rc_code_1 !== undefined) {
          codeBlock += `          rc_code_1: ${code.parameters.rc_code_1}\n`;
        }
        if (code.parameters.rc_code_2 !== undefined) {
          codeBlock += `          rc_code_2: ${code.parameters.rc_code_2}\n`;
        }
        break;

      case "coolix":
        if (code.parameters.first !== undefined) {
          codeBlock += `          first: ${code.parameters.first}\n`;
        }
        if (code.parameters.second !== undefined) {
          codeBlock += `          second: ${code.parameters.second}\n`;
        }
        break;

      case "dish":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        break;

      case "midea":
        if (code.parameters.code !== undefined) {
          if (Array.isArray(code.parameters.code)) {
            const codeArray = code.parameters.code
              .map(
                (byte) =>
                  `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`,
              )
              .join(", ");
            codeBlock += `          code: [${codeArray}]\n`;
          } else {
            codeBlock += `          code: ${code.parameters.code}\n`;
          }
        }
        break;

      case "aeha":
        if (code.parameters.address !== undefined) {
          codeBlock += `          address: ${code.parameters.address}\n`;
        }
        if (code.parameters.data !== undefined) {
          if (Array.isArray(code.parameters.data)) {
            const dataArray = code.parameters.data
              .map(
                (byte) =>
                  `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`,
              )
              .join(", ");
            codeBlock += `          data: [${dataArray}]\n`;
          } else {
            codeBlock += `          data: ${code.parameters.data}\n`;
          }
        }
        if (code.parameters.carrier_frequency !== undefined) {
          codeBlock += `          carrier_frequency: ${code.parameters.carrier_frequency}Hz\n`;
        }
        break;

      case "raw":
        if (code.parameters.code !== undefined) {
          if (Array.isArray(code.parameters.code)) {
            const rawCode = code.parameters.code.join(", ");
            codeBlock += `          code: [${rawCode}]\n`;
          } else {
            codeBlock += `          code: ${code.parameters.code}\n`;
          }
        }
        if (code.parameters.carrier_frequency !== undefined) {
          codeBlock += `          carrier_frequency: ${code.parameters.carrier_frequency}Hz\n`;
        }
        break;

      case "pronto":
        if (code.parameters.data !== undefined) {
          codeBlock += `          data: "${code.parameters.data}"\n`;
        }
        break;

      case "toshiba_ac":
        if (code.parameters.rc_code_1 !== undefined) {
          codeBlock += `          rc_code_1: ${code.parameters.rc_code_1}\n`;
        }
        if (code.parameters.rc_code_2 !== undefined) {
          codeBlock += `          rc_code_2: ${code.parameters.rc_code_2}\n`;
        }
        break;

      case "haier":
        if (code.parameters.code !== undefined) {
          if (Array.isArray(code.parameters.code)) {
            const codeArray = code.parameters.code
              .map(
                (byte) =>
                  `0x${byte.toString(16).toUpperCase().padStart(2, "0")}`,
              )
              .join(", ");
            codeBlock += `          code: [${codeArray}]\n`;
          } else {
            codeBlock += `          code: ${code.parameters.code}\n`;
          }
        }
        break;

      case "roomba":
        if (code.parameters.data !== undefined) {
          codeBlock += `          data: ${code.parameters.data}\n`;
        }
        // Add default repeat for Roomba as per documentation
        codeBlock += `          repeat:\n            times: 3\n            wait_time: 17ms\n`;
        break;

      case "toto":
        if (code.parameters.command !== undefined) {
          codeBlock += `          command: ${code.parameters.command}\n`;
        }
        if (code.parameters.rc_code_1 !== undefined) {
          codeBlock += `          rc_code_1: ${code.parameters.rc_code_1}\n`;
        }
        if (code.parameters.rc_code_2 !== undefined) {
          codeBlock += `          rc_code_2: ${code.parameters.rc_code_2}\n`;
        }
        break;

      default:
        // Generic parameter handling for other protocols
        Object.entries(code.parameters).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            if (Array.isArray(value)) {
              const arrayValue = value
                .map((item) =>
                  typeof item === "number"
                    ? `0x${item.toString(16).toUpperCase().padStart(2, "0")}`
                    : item,
                )
                .join(", ");
              codeBlock += `          ${key}: [${arrayValue}]\n`;
            } else if (
              typeof value === "string" &&
              !value.startsWith("0x") &&
              isNaN(Number(value))
            ) {
              codeBlock += `          ${key}: "${value}"\n`;
            } else {
              codeBlock += `          ${key}: ${value}\n`;
            }
          }
        });
        break;
    }

    return codeBlock;
  };

  const generateESPHomeExport = (): string => {
    const sanitizedDeviceName = deviceName
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .toLowerCase();

    let yamlContent = `# ESPHome Remote Control Configuration
# Device: ${deviceName} (${manufacturer}${model ? ` ${model}` : ""})
# Generated by Remote Control Hub
# Generated on: ${new Date().toLocaleString()}
# Total codes: ${codes.length}

# Add this to your ESPHome configuration file

# Remote transmitter configuration (add to your main config if not already present)
remote_transmitter:
  pin: GPIO14  # Change this to your IR LED pin
  carrier_duty_percent: 50%

# Button entities for ${deviceName}
button:
`;

    codes.forEach((code) => {
      const sanitizedButtonName = code.name
        .replace(/[^a-zA-Z0-9_\s]/g, "")
        .trim();
      const buttonId = `${sanitizedDeviceName}_${sanitizedButtonName.replace(/\s+/g, "_").toLowerCase()}`;

      yamlContent += `  - platform: template
    name: "${deviceName} ${sanitizedButtonName}"
    id: ${buttonId}
    on_press:
${generateESPHomeCodeBlock(code)}
`;
    });

    return yamlContent;
  };

  const generateESPHomeSubDeviceExport = (): string => {
    const sanitizedDeviceName = deviceName
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .toLowerCase();

    let yamlContent = `# ESPHome Remote Control Configuration with Sub-Devices
# Device: ${deviceName} (${manufacturer}${model ? ` ${model}` : ""})
# Generated by Remote Control Hub
# Generated on: ${new Date().toLocaleString()}
# Total codes: ${codes.length}

# Add this to your ESPHome configuration file

# Remote transmitter configuration (add to your main config if not already present)
remote_transmitter:
  pin: GPIO14  # Change this to your IR LED pin
  carrier_duty_percent: 50%

# Sub-device configuration for ${deviceName}
esphome:
  devices:
    - id: ${sanitizedDeviceName}_device
      name: "${deviceName}"

# Button entities for ${deviceName} associated with sub-device
button:
`;

    codes.forEach((code) => {
      const sanitizedButtonName = code.name
        .replace(/[^a-zA-Z0-9_\s]/g, "")
        .trim();
      const buttonId = `${sanitizedDeviceName}_${sanitizedButtonName.replace(/\s+/g, "_").toLowerCase()}`;

      yamlContent += `  - platform: template
    name: "${deviceName} ${sanitizedButtonName}"
    id: ${buttonId}
    device_id: ${sanitizedDeviceName}_device
    on_press:
${generateESPHomeCodeBlock(code)}
`;
    });

    return yamlContent;
  };

  const getExportContent = (): string => {
    switch (selectedFormat) {
      case "json":
        return generateJSONExport();
      case "esphome":
        return generateESPHomeExport();
      case "esphome-subdevice":
        return generateESPHomeSubDeviceExport();
      default:
        return "";
    }
  };

  const getFileName = (): string => {
    const sanitizedName = deviceName
      .replace(/[^a-zA-Z0-9_\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();
    const timestamp = new Date().toISOString().split("T")[0];

    switch (selectedFormat) {
      case "json":
        return `${sanitizedName}_remote_codes_${timestamp}.json`;
      case "esphome":
        return `${sanitizedName}_esphome_config_${timestamp}.yaml`;
      case "esphome-subdevice":
        return `${sanitizedName}_esphome_subdevice_config_${timestamp}.yaml`;
      default:
        return `${sanitizedName}_export.txt`;
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    const fileName = getFileName();
    const mimeType =
      selectedFormat === "json" ? "application/json" : "text/yaml";

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      const content = getExportContent();
      await navigator.clipboard.writeText(content);
      setCopiedFormat(selectedFormat);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
  };

  const exportContent = getExportContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Remote Control Codes
            <Badge variant="secondary">{codes.length} codes</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 min-h-0">
          {/* Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <Card
              className={`cursor-pointer transition-colors ${
                selectedFormat === "esphome"
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => setSelectedFormat("esphome")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5" />
                  ESPHome YAML
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Ready-to-use ESPHome configuration with button templates and
                  remote transmitter setup.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    .yaml
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ESPHome Ready
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Button Templates
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-colors ${
                selectedFormat === "esphome-subdevice"
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => setSelectedFormat("esphome-subdevice")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5" />
                  ESPHome Sub-Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  ESPHome configuration with sub-device structure for grouping
                  entities in Home Assistant.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    .yaml
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ESPHome 2025.7+
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Sub-Devices
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-colors ${
                selectedFormat === "json" ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => setSelectedFormat("json")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  JSON Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Structured data format with device info, codes, and metadata
                  for integration or backup.
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    .json
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Structured Data
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Metadata
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Format-specific Information */}
          <div className="shrink-0">
            {selectedFormat === "esphome" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>ESPHome Configuration:</strong> This export generates
                  a complete ESPHome YAML configuration with button templates.
                  Copy the content to your ESPHome device configuration file and
                  adjust the GPIO pin number for your IR transmitter.
                </AlertDescription>
              </Alert>
            )}

            {selectedFormat === "esphome-subdevice" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>ESPHome Sub-Device Configuration:</strong> This export
                  generates an ESPHome YAML configuration with sub-device
                  structure for ESPHome 2025.7+. Each device appears as a
                  separate entity in Home Assistant. Adjust the GPIO pin as
                  needed.
                </AlertDescription>
              </Alert>
            )}

            {selectedFormat === "json" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>JSON Export:</strong> This format includes device
                  metadata, all captured codes with their parameters, and
                  ESPHome code blocks. Perfect for backup, sharing, or
                  integration with other tools.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Preview - This should take remaining space */}
          <div className="flex-1 min-h-0">
            <ResponsiveCodePreview
              code={exportContent}
              format={getPreviewFormat(selectedFormat)}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copied={copiedFormat === selectedFormat}
              fileName={getFileName()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
