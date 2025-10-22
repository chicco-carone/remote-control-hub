import type { ESPHomeFormattedCode } from "@/lib/device-export";
import {
  convertToESPHomeFormat,
  downloadFile,
  getExportContentForFormat,
  getExportFileName,
} from "@/lib/device-export";
import type { ConvexDevice } from "@/types/convex";
import type { ExportFormat } from "@/types/form";
import { useState } from "react";

export function useExportLogic(
  device: ConvexDevice | null,
  initialFormat: ExportFormat = "esphome",
) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] =
    useState<ExportFormat>(initialFormat);

  const handleDirectExport = (format: ExportFormat) => {
    if (!device) return;

    const content = getExportContentForFormat(device, format);
    const fileName = getExportFileName(device, format);
    const mimeType = format === "json" ? "application/json" : "text/yaml";

    downloadFile(content, fileName, mimeType);
  };

  const handleOpenModal = () => {
    setIsExportDialogOpen(true);
  };

  const espHomeFormattedCodes: ESPHomeFormattedCode[] = device
    ? convertToESPHomeFormat(device)
    : [];

  return {
    espHomeFormattedCodes,
    isExportDialogOpen,
    selectedExportFormat,
    setSelectedExportFormat,
    handleDirectExport,
    handleOpenModal,
    handleCloseModal: () => setIsExportDialogOpen(false),
  };
}
