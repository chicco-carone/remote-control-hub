"use client";

import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalHotkeys } from "@/hooks/use-global-hotkeys";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider dynamic appearance={clerkAppearance}>
      <ConvexClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalHotkeys />
          {children}
        </ThemeProvider>{" "}
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
