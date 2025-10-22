export interface RemoteCode {
  id: string;
  name: string;
  code: string;
  uploadedBy: string;
  uploadedByImage: string;
  uploadedAt: string;
  votes: {
    thumbsUp: number;
    thumbsDown: number;
  };
  userVote?: "up" | "down" | null;
}

export interface Device {
  id: string;
  name: string;
  manufacturer: string;
  model?: string;
  deviceType: string;
  codes: RemoteCode[];
  notes?: string;
  uploadedBy: string;
  uploadedByImage: string;
  uploadedAt: string;
  totalVotes: {
    thumbsUp: number;
    thumbsDown: number;
  };
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  joinedAt: string;
  contributionsCount: number;
  reputation: number;
}

export interface Vote {
  id: string;
  userId: string;
  codeId: string;
  deviceId: string;
  type: "up" | "down";
  createdAt: string;
}

export interface DeviceButton {
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface DeviceButtonConfig {
  deviceType: string;
  defaultButtons: DeviceButton[];
}
