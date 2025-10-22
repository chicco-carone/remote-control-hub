// MainSearchFilterBar.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryStats } from "@/types/convex";
import { Filter, Search } from "lucide-react";

/**
 * Renders the search input and category select dropdown for the main page.
 */
export interface MainSearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: CategoryStats[];
}

export default function MainSearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
}: MainSearchFilterBarProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by device type, brand, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {searchQuery && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Found {categories.reduce((sum, cat) => sum + cat.count, 0)} devices
            in {categories.length} categories
          </span>
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
