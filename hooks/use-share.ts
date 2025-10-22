import { useState } from "react";
import { toast } from "sonner";

export function useShare(deviceName: string, manufacturer: string) {
  const [sharedRecently, setSharedRecently] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${deviceName} - Remote Control Codes`,
          text: `Check out these remote control codes for ${deviceName} by ${manufacturer}`,
          url: window.location.href,
        });
        setSharedRecently(true);
        setTimeout(() => setSharedRecently(false), 2000);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setSharedRecently(true);
        setTimeout(() => setSharedRecently(false), 2000);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link:", err);
        toast.error("Failed to copy link to clipboard");
      }
    }
  };

  return {
    sharedRecently,
    handleShare,
  };
}
