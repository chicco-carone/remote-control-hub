"use client";

import { Theme } from "@/types/theme";
import * as React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">(
    "light",
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    let systemTheme: "dark" | "light" = "light";

    if (enableSystem) {
      systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    const themeToApply = theme === "system" ? systemTheme : theme;
    setResolvedTheme(themeToApply);

    if (attribute === "class") {
      root.classList.add(themeToApply);
    } else {
      root.setAttribute(attribute, themeToApply);
    }

    // Handle transitions
    if (disableTransitionOnChange) {
      const css = document.createElement("style");
      css.appendChild(
        document.createTextNode(
          `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
        ),
      );
      document.head.appendChild(css);

      return () => {
        // Force reflow
        (() => window.getComputedStyle(document.body))();

        // Wait for next tick before removing
        setTimeout(() => {
          document.head.removeChild(css);
        }, 1);
      };
    }
  }, [theme, attribute, enableSystem, disableTransitionOnChange]);

  React.useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(systemTheme);

        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (attribute === "class") {
          root.classList.add(systemTheme);
        } else {
          root.setAttribute(attribute, systemTheme);
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, attribute, enableSystem]);

  const value = React.useMemo(() => {
    const setTheme = (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setThemeState(newTheme);
    };

    return {
      theme,
      setTheme,
      resolvedTheme,
    };
  }, [theme, resolvedTheme, storageKey]);

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
