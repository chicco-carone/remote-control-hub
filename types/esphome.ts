import { DeviceButton } from "@/types/types";

export interface ESPHomeDevice {
  ip: string;
  password?: string;
  encryptionKey?: string;
  name?: string;
  version?: string;
}

export interface ESPHomeLogEntry {
  timestamp: string;
  level: "INFO" | "DEBUG" | "WARN" | "ERROR";
  component: string;
  message: string;
}

export interface CapturedCode {
  protocol: string;
  parameters: Record<string, string | number | boolean>;
  rawData: string;
  timestamp: string;
}

export interface ESPHomeConnection {
  device: ESPHomeDevice;
  connected: boolean;
  logs: ESPHomeLogEntry[];
  onLogReceived?: (log: ESPHomeLogEntry) => void;
  onCodeCaptured?: (code: CapturedCode) => void;
}

export interface CapturedButtonCode {
  button: DeviceButton;
  code: CapturedCode | null;
  captured: boolean;
}
