// DeviceEmptyState.tsx

import { Button } from "@/components/ui/button";
import React from "react";

/**
 * Empty state for when no devices are found.
 */
interface DeviceEmptyStateProps {
  searchQuery: string;
  selectedManufacturer: string;
  categoryName: string;
  onClearFilters: () => void;
}

const DeviceEmptyState: React.FC<DeviceEmptyStateProps> = ({
  searchQuery,
  selectedManufacturer,
  categoryName,
  onClearFilters,
}) => (
  <div className="text-center py-12">
    <div className="mx-auto max-w-md">
      <div className="mb-4 text-6xl">🔍</div>
      <h3 className="text-lg font-semibold mb-2">No devices found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery || selectedManufacturer !== "all"
          ? "Try adjusting your search or filters to find what you're looking for."
          : `No ${categoryName.toLowerCase()} devices available yet.`}
      </p>
      {(searchQuery || selectedManufacturer !== "all") && (
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  </div>
);

export default DeviceEmptyState;
