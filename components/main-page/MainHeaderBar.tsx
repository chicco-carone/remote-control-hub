// MainHeaderBar.tsx

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Renders the header bar for the main page, including branding,
 * login button, theme toggle, and contribute button.
 */
export default function MainHeaderBar() {
  const router = useRouter();
  const { isAuthenticated } = useCurrentUser();
  return (
    <header className="border-b bg-card/95 backdrop-blur-sm supports-backdrop-filter:bg-card/60 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Remote Control Hub
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Discover and share remote control codes for all your devices
            </p>
          </div>
          <div className="flex items-center gap-3 justify-end md:justify-start">
            {isAuthenticated ? <UserButton /> : <SignInButton />}
            <ThemeToggle />
            <Button
              onClick={() => router.push("/add-device")}
              size="sm"
              className="md:w-auto"
            >
              <Plus className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline">Add Device</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
