// DeviceGrid.tsx

import { DeviceCard } from "@/components/device-card";
import { Device } from "@/types/types";
import React from "react";

/**
 * Grid for displaying a list of devices.
 */
interface DeviceGridProps {
  devices: Device[];
  onDeviceUpdate: (device: Device) => void;
}

const DeviceGrid: React.FC<DeviceGridProps> = ({ devices, onDeviceUpdate }) => {
  if (devices.length === 0) {
    return null;
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onDeviceUpdate={onDeviceUpdate}
        />
      ))}
    </div>
  );
};

export default DeviceGrid;
