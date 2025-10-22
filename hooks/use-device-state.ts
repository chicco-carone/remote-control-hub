import type { ConvexDevice, ConvexRemoteCode } from "@/types/convex";
import { useMemo, useState } from "react";

export function useDeviceState(initialDevice: ConvexDevice | null | undefined) {
  const [localDevice, setLocalDevice] = useState<ConvexDevice | null>(
    initialDevice || null,
  );

  useMemo(() => {
    if (initialDevice) {
      setLocalDevice(initialDevice);
    }
  }, [initialDevice]);

  const handleVoteChange = (updatedCode: ConvexRemoteCode) => {
    if (!localDevice) return;

    const updatedDevice = {
      ...localDevice,
      codes: localDevice.codes.map((code) =>
        code.id === updatedCode.id ? updatedCode : code,
      ),
    };

    // Recalculate total votes based on all codes
    updatedDevice.totalVotes = updatedDevice.codes.reduce(
      (total, code) => ({
        thumbsUp: total.thumbsUp + code.votes.thumbsUp,
        thumbsDown: total.thumbsDown + code.votes.thumbsDown,
      }),
      { thumbsUp: 0, thumbsDown: 0 },
    );

    setLocalDevice(updatedDevice);
  };

  const effectiveness =
    localDevice &&
    localDevice.totalVotes.thumbsUp + localDevice.totalVotes.thumbsDown > 0
      ? Math.round(
          (localDevice.totalVotes.thumbsUp /
            (localDevice.totalVotes.thumbsUp +
              localDevice.totalVotes.thumbsDown)) *
            100,
        )
      : 0;

  return {
    localDevice,
    handleVoteChange,
    effectiveness,
    isLoading: localDevice === null,
  };
}
