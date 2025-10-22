"use client";

// components/device/device-header.tsx
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { ExportFormat } from "@/types/form";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ExportButtonWithDropdown } from "./export-button-dropdown";

interface DeviceHeaderProps {
  name: string;
  manufacturer: string;
  model?: string;
  onDirectExport: (format: ExportFormat) => void;
  onShare: () => void;
  sharedRecently?: boolean;
}

export function DeviceHeader({
  name,
  manufacturer,
  model,
  onDirectExport,
  onShare,
  sharedRecently = false,
}: DeviceHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm supports-backdrop-filter:bg-card/60 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              onClick={() => router.push("/")}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push("/");
              }}
            >
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Back</span>
              </Button>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {name}
              </h1>
              <p className="text-muted-foreground">
                {manufacturer} {model && `• ${model}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ExportButtonWithDropdown onDirectExport={onDirectExport} />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={sharedRecently ? { scale: [1, 1.1, 1] } : {}}
              transition={
                sharedRecently ? { duration: 0.6, ease: "easeOut" } : {}
              }
            >
              <Button variant="outline" size="sm" onClick={onShare}>
                {sharedRecently ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      duration: 0.5,
                    }}
                  >
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.div>
                )}
                <span className="hidden md:inline ml-2">Share</span>
              </Button>
            </motion.div>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
