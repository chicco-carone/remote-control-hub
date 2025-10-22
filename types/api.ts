import { RemoteCode } from "./types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Request/Response types
export interface SubmitDeviceRequest {
  name: string;
  manufacturer: string;
  model?: string;
  deviceType: string;
  codes: Omit<
    RemoteCode,
    "id" | "uploadedBy" | "uploadedAt" | "votes" | "userVote"
  >[];
  notes?: string;
}

export interface VoteRequest {
  codeId: string;
  deviceId: string;
  type: "up" | "down";
}
