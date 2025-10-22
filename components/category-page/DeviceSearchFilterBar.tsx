// DeviceSearchFilterBar.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import React from "react";

/**
 * Search and filter bar for device lists.
 */
interface DeviceSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  manufacturers: string[];
  selectedManufacturer: string;
  onManufacturerChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const DeviceSearchFilterBar: React.FC<DeviceSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  manufacturers,
  selectedManufacturer,
  onManufacturerChange,
  sortBy,
  onSortByChange,
  activeFiltersCount,
  onClearFilters,
}) => (
  <div className="mb-8 space-y-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search devices..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={selectedManufacturer}
          onValueChange={onManufacturerChange}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {manufacturers.map((manufacturer) => (
              <SelectItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="manufacturer">Brand A-Z</SelectItem>
            <SelectItem value="codes">Most Codes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    {activeFiltersCount > 0 && (
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Active filters:</span>
        {searchQuery && (
          <Badge variant="secondary" className="gap-1">
            Search: {searchQuery}
          </Badge>
        )}
        {selectedManufacturer !== "all" && (
          <Badge variant="secondary" className="gap-1">
            {selectedManufacturer}
          </Badge>
        )}
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    )}
  </div>
);

export default DeviceSearchFilterBar;
