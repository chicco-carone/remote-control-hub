"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddDeviceHeaderProps {
  title: string;
  description: string;
}

export function AddDeviceHeader({ title, description }: AddDeviceHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-b bg-card/95 backdrop-blur-sm supports-backdrop-filter:bg-card/60 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
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
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
