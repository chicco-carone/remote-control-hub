import { useState } from "react";

export function useClipboard() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, codeName: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(codeName);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return {
    copiedCode,
    copyToClipboard,
  };
}
