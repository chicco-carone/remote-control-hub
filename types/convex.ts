import { Id } from "@/convex/_generated/dataModel";

// Convex-compatible types that extend the original types
export interface ConvexRemoteCode {
  id: Id<"codes">;
  name: string;
  code: string;
  uploadedBy: string; // Author name
  uploadedByImage: string; // Author image
  uploadedAt: string;
  votes: {
    thumbsUp: number;
    thumbsDown: number;
  };
  userVote?: "up" | "down" | null;
}

export interface ConvexDevice {
  id: Id<"devices">;
  name: string;
  manufacturer: string;
  model?: string;
  deviceType: string;
  codes: ConvexRemoteCode[];
  notes?: string;
  uploadedBy: string; // Author name
  uploadedByImage: string; // Author image
  uploadedAt: string;
  totalVotes: {
    thumbsUp: number;
    thumbsDown: number;
  };
}

export interface ConvexUser {
  id: Id<"users">;
  username: string;
  displayName: string;
  avatar?: string;
  joinedAt: string;
  contributionsCount: number;
  reputation: number;
}

export interface ConvexVote {
  id: Id<"votes">;
  userId: Id<"users">;
  codeId: Id<"codes">;
  deviceId: Id<"devices">;
  type: "up" | "down";
  createdAt: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  devices: ConvexDevice[];
  totalCodes: number;
  effectiveness: number;
}
