"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Fan,
  Home,
  Menu,
  Minus,
  Monitor,
  Moon,
  Move,
  Plus,
  Power,
  Radio,
  Settings,
  Thermometer,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ButtonIconProps {
  name: string;
  className?: string;
}

const iconMap = {
  power: Power,
  "volume-2": Volume2,
  "volume-1": Volume1,
  "volume-x": VolumeX,
  "chevron-up": ChevronUp,
  "chevron-down": ChevronDown,
  menu: Menu,
  home: Home,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  check: Check,
  monitor: Monitor,
  thermometer: Thermometer,
  settings: Settings,
  fan: Fan,
  clock: Clock,
  move: Move,
  moon: Moon,
  radio: Radio,
  plus: Plus,
  minus: Minus,
  circle: Circle,
};

export function ButtonIcon({ name, className = "h-4 w-4" }: ButtonIconProps) {
  const IconComponent = iconMap[name as keyof typeof iconMap] || Circle;
  return <IconComponent className={className} />;
}
