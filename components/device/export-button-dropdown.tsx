"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ExportFormat } from "@/types/form";
import { ChevronDown, Code, FileDown, FileText } from "lucide-react";
import { useState } from "react";

interface ExportButtonWithDropdownProps {
  onDirectExport: (format: ExportFormat) => void;
  disabled?: boolean;
}

export function ExportButtonWithDropdown({
  onDirectExport,
  disabled = false,
}: ExportButtonWithDropdownProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("esphome");

  const formatLabels = {
    esphome: "ESPHome YAML",
    "esphome-subdevice": "ESPHome Sub-Devices",
    json: "JSON Format",
  };

  const formatLabelsMobile = {
    esphome: "ESP",
    "esphome-subdevice": "Sub",
    json: "JSON",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Direct Export Button with Dropdown */}
      <div className="flex items-center">
        <Button
          onClick={() => onDirectExport(selectedFormat)}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white rounded-r-none border-r border-green-500"
          disabled={disabled}
        >
          <FileDown className="hidden sm:inline h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{formatLabels[selectedFormat]}</span>
          <span className="sm:hidden">{formatLabelsMobile[selectedFormat]}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white rounded-l-none border-l-0 px-2"
              disabled={disabled}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px]">
            <DropdownMenuItem onClick={() => setSelectedFormat("esphome")}>
              <Code className="h-4 w-4 mr-2" />
              ESPHome YAML
              {selectedFormat === "esphome" && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setSelectedFormat("esphome-subdevice")}
            >
              <Code className="h-4 w-4 mr-2" />
              ESPHome Sub-Devices
              {selectedFormat === "esphome-subdevice" && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedFormat("json")}>
              <FileText className="h-4 w-4 mr-2" />
              JSON Format
              {selectedFormat === "json" && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
