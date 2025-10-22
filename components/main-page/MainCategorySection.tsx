// MainCategorySection.tsx

import { CategoryGrid } from "@/components/category-grid";
import { Badge } from "@/components/ui/badge";
import type { CategoryStats } from "@/types/convex";

/**
 * Renders the category section with grid and badge for the main page.
 */
export interface MainCategorySectionProps {
  filteredCategories: CategoryStats[];
  searchQuery: string;
}

export default function MainCategorySection({
  filteredCategories,
  searchQuery,
}: MainCategorySectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Find devices organized by type
          </p>
        </div>
        {searchQuery && (
          <Badge variant="secondary" className="text-sm">
            {filteredCategories.length} categories found
          </Badge>
        )}
      </div>
      <CategoryGrid categories={filteredCategories} />
    </section>
  );
}
