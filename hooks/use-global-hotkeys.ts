import { useEffect } from "react";

/**
 * Hook for handling global hotkeys across the application
 */
export function useGlobalHotkeys() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+F (Windows/Linux) or Cmd+F (macOS)
      if ((event.ctrlKey || event.metaKey) && (event.key === "f" || event.key === "F")) {
        event.preventDefault();

        // Find and focus search inputs
        const searchInputs = document.querySelectorAll('input[placeholder*="search" i], input[placeholder*="cerca" i]') as NodeListOf<HTMLInputElement>;

        // Focus the first search input found
        if (searchInputs.length > 0) {
          searchInputs[0].focus();
          // Scroll to ensure the input is visible
          searchInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

/**
 * Component that applies global hotkeys to the application
 */
export function GlobalHotkeys() {
  useGlobalHotkeys();
  return null;
}
