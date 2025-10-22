export interface LoginActivity {
  id: string;
  timestamp: string;
  location: string;
  device: string;
  browser: string;
  ip: string;
  status: "success" | "failed";
}

export interface AccountChange {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: "profile" | "security" | "settings";
}
