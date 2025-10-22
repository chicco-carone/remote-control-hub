// MainEmptySearchState.tsx

import { Button } from "@/components/ui/button";

/**
 * Renders the empty search state for the main page.
 */
export interface MainEmptySearchStateProps {
  setSearchQuery: (value: string) => void;
}

export default function MainEmptySearchState({
  setSearchQuery,
}: MainEmptySearchStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-4 text-6xl">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search terms or browse our categories to find what
          you&apos;re looking for.
        </p>
        <Button variant="outline" onClick={() => setSearchQuery("")}>
          Clear search
        </Button>
      </div>
    </div>
  );
}
