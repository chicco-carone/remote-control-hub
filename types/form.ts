import { ESPHomeConnection, ESPHomeDevice } from "@/types/esphome";

export interface FormData {
  name: string;
  manufacturer: string;
  model: string;
  deviceType: string;
  notes: string;
  protocol: string;
}

export interface ESPHomeCode {
  name: string;
  protocol: string;
  parameters: Record<string, any>;
}

export interface FormErrors {
  name?: string;
  manufacturer?: string;
  model?: string;
  deviceType?: string;
  notes?: string;
  protocol?: string;
  codes?: {
    [codeIndex: number]: {
      name?: string;
      parameters?: { [paramName: string]: string };
    };
  };
  general?: string;
}

export interface CodesRecapCardProps {
  codes: ESPHomeCode[];
  deviceType: string;
  protocol: string;
  deviceName: string;
  manufacturer: string;
  model?: string;
  onCodesUpdate: (updatedCodes: ESPHomeCode[]) => void;
  onProceed: () => void;
  onGoBack: () => void;
}

export interface EditingCode extends ESPHomeCode {
  originalIndex: number;
}
export interface ExportCodesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  codes: ESPHomeCode[];
  deviceName: string;
  deviceType: string;
  manufacturer: string;
  model?: string;
}

export interface ESPHomeConnectionFormProps {
  onConnect: (device: ESPHomeDevice) => void;
  isConnecting: boolean;
  connectionError?: string;
  isConnected: boolean;
}

export interface SSEESPHomeConnection extends ESPHomeConnection {
  eventSource?: EventSource;
  selectedProtocol?: string;
  reconnectAttempts?: number;
  lastError?: string;
}

export type ExportFormat = "json" | "esphome" | "esphome-subdevice";
export type CodePreviewFormat = "esphome" | "json";
