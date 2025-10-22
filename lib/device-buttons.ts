import { DeviceButton, DeviceButtonConfig } from "@/types/types";
const deviceButtonConfigs: Record<string, DeviceButtonConfig> = {
  TV: {
    deviceType: "TV",
    defaultButtons: [
      {
        name: "Power",
        description: "Turn TV on/off",
        icon: "power",
        category: "basic",
      },
      {
        name: "Volume Up",
        description: "Increase volume",
        icon: "volume-2",
        category: "audio",
      },
      {
        name: "Volume Down",
        description: "Decrease volume",
        icon: "volume-1",
        category: "audio",
      },
      {
        name: "Mute",
        description: "Mute/unmute audio",
        icon: "volume-x",
        category: "audio",
      },
      {
        name: "Channel Up",
        description: "Next channel",
        icon: "chevron-up",
        category: "navigation",
      },
      {
        name: "Channel Down",
        description: "Previous channel",
        icon: "chevron-down",
        category: "navigation",
      },
      {
        name: "Menu",
        description: "Open main menu",
        icon: "menu",
        category: "navigation",
      },
      {
        name: "Home",
        description: "Go to home screen",
        icon: "home",
        category: "navigation",
      },
      {
        name: "Back",
        description: "Go back",
        icon: "arrow-left",
        category: "navigation",
      },
      {
        name: "OK/Enter",
        description: "Confirm selection",
        icon: "check",
        category: "navigation",
      },
      {
        name: "Up",
        description: "Navigate up",
        icon: "arrow-up",
        category: "directional",
      },
      {
        name: "Down",
        description: "Navigate down",
        icon: "arrow-down",
        category: "directional",
      },
      {
        name: "Left",
        description: "Navigate left",
        icon: "arrow-left",
        category: "directional",
      },
      {
        name: "Right",
        description: "Navigate right",
        icon: "arrow-right",
        category: "directional",
      },
      {
        name: "Input/Source",
        description: "Change input source",
        icon: "monitor",
        category: "basic",
      },
    ],
  },
  "Air Conditioner": {
    deviceType: "Air Conditioner",
    defaultButtons: [
      {
        name: "Power",
        description: "Turn AC on/off",
        icon: "power",
        category: "basic",
      },
      {
        name: "Temperature Up",
        description: "Increase temperature",
        icon: "thermometer",
        category: "temperature",
      },
      {
        name: "Temperature Down",
        description: "Decrease temperature",
        icon: "thermometer",
        category: "temperature",
      },
      {
        name: "Mode",
        description: "Change mode (Cool/Heat/Fan/Auto)",
        icon: "settings",
        category: "basic",
      },
      {
        name: "Fan Speed",
        description: "Change fan speed",
        icon: "fan",
        category: "basic",
      },
      {
        name: "Timer",
        description: "Set timer",
        icon: "clock",
        category: "basic",
      },
      {
        name: "Swing",
        description: "Toggle swing mode",
        icon: "move",
        category: "basic",
      },
      {
        name: "Sleep",
        description: "Sleep mode",
        icon: "moon",
        category: "basic",
      },
    ],
  },
  "Sound System": {
    deviceType: "Sound System",
    defaultButtons: [
      {
        name: "Power",
        description: "Turn system on/off",
        icon: "power",
        category: "basic",
      },
      {
        name: "Volume Up",
        description: "Increase volume",
        icon: "volume-2",
        category: "audio",
      },
      {
        name: "Volume Down",
        description: "Decrease volume",
        icon: "volume-1",
        category: "audio",
      },
      {
        name: "Mute",
        description: "Mute/unmute audio",
        icon: "volume-x",
        category: "audio",
      },
      {
        name: "Input/Source",
        description: "Change input source",
        icon: "radio",
        category: "basic",
      },
      {
        name: "Bass Up",
        description: "Increase bass",
        icon: "plus",
        category: "audio",
      },
      {
        name: "Bass Down",
        description: "Decrease bass",
        icon: "minus",
        category: "audio",
      },
      {
        name: "Treble Up",
        description: "Increase treble",
        icon: "plus",
        category: "audio",
      },
      {
        name: "Treble Down",
        description: "Decrease treble",
        icon: "minus",
        category: "audio",
      },
    ],
  },
};

const defaultButtons: DeviceButton[] = [
  {
    name: "Power",
    description: "Turn device on/off",
    icon: "power",
    category: "basic",
  },
  {
    name: "Menu",
    description: "Open menu",
    icon: "menu",
    category: "navigation",
  },
  {
    name: "OK/Enter",
    description: "Confirm selection",
    icon: "check",
    category: "navigation",
  },
  {
    name: "Back",
    description: "Go back",
    icon: "arrow-left",
    category: "navigation",
  },
  {
    name: "Up",
    description: "Navigate up",
    icon: "arrow-up",
    category: "directional",
  },
  {
    name: "Down",
    description: "Navigate down",
    icon: "arrow-down",
    category: "directional",
  },
  {
    name: "Left",
    description: "Navigate left",
    icon: "arrow-left",
    category: "directional",
  },
  {
    name: "Right",
    description: "Navigate right",
    icon: "arrow-right",
    category: "directional",
  },
];

export function getDeviceButtons(deviceType: string): DeviceButton[] {
  const config = deviceButtonConfigs[deviceType];
  return config ? config.defaultButtons : defaultButtons;
}

export function getButtonIcon(iconName: string) {
  // This would map icon names to actual Lucide React icons
  // For now, we'll return the icon name and handle it in the component
  return iconName;
}
