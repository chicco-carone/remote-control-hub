"use client";

import CategoryHeader from "@/components/category-page/CategoryHeader";
import CategoryNotFound from "@/components/category-page/CategoryNotFound";
import DeviceEmptyState from "@/components/category-page/DeviceEmptyState";
import DeviceGrid from "@/components/category-page/DeviceGrid";
import DeviceSearchFilterBar from "@/components/category-page/DeviceSearchFilterBar";
import { api } from "@/convex/_generated/api";
import type { Device } from "@/types/types";
import { useQuery } from "convex/react";
import { SortAsc } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const decodedSlug = decodeURIComponent(categorySlug);
  const categoryName = decodedSlug
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/-/g, " ");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] =
    useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  // Fetch devices for this category from Convex
  const devices = useQuery(api.queries.getDevicesByCategory, {
    deviceType: decodedSlug.toLowerCase().replace(/-/g, " "),
  });

  // Get unique manufacturers for this category
  const manufacturers = useMemo<string[]>(() => {
    if (!devices) return [];
    const uniqueManufacturers = Array.from(
      new Set(devices.map((device: Device) => device.manufacturer)),
    );
    return uniqueManufacturers.sort();
  }, [devices]);

  // Filter and sort devices
  const filteredDevices = useMemo<Device[]>(() => {
    if (!devices) return [];
    const filtered = devices.filter((device: Device) => {
      const matchesSearch =
        searchQuery === "" ||
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.model?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesManufacturer =
        selectedManufacturer === "all" ||
        device.manufacturer === selectedManufacturer;

      return matchesSearch && matchesManufacturer;
    });

    // Sort devices
    switch (sortBy) {
      case "popular":
        filtered.sort((a: Device, b: Device) => {
          const aTotal = a.totalVotes.thumbsUp + a.totalVotes.thumbsDown;
          const bTotal = b.totalVotes.thumbsUp + b.totalVotes.thumbsDown;
          return bTotal - aTotal;
        });
        break;
      case "newest":
        filtered.sort(
          (a: Device, b: Device) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        );
        break;
      case "name":
        filtered.sort((a: Device, b: Device) => a.name.localeCompare(b.name));
        break;
      case "manufacturer":
        filtered.sort((a: Device, b: Device) =>
          a.manufacturer.localeCompare(b.manufacturer),
        );
        break;
      case "codes":
        filtered.sort(
          (a: Device, b: Device) => b.codes.length - a.codes.length,
        );
        break;
    }

    return filtered;
  }, [devices, searchQuery, selectedManufacturer, sortBy]);

  const handleDeviceUpdate = (updatedDevice: Device): void => {
    // In a real app, this would update the global state or refetch data
    console.log("Device updated:", updatedDevice);
  };

  const clearFilters = (): void => {
    setSearchQuery("");
    setSelectedManufacturer("all");
  };

  const activeFiltersCount: number = [
    searchQuery !== "",
    selectedManufacturer !== "all",
  ].filter(Boolean).length;

  if (devices === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground">Loading devices...</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return <CategoryNotFound categoryName={categoryName} />;
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <CategoryHeader
        categoryName={categoryName}
        deviceCount={devices.length}
        codesCount={devices.reduce(
          (sum: number, device: Device) => sum + device.codes.length,
          0,
        )}
      />
      <main className="container mx-auto px-4 py-8">
        <DeviceSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          manufacturers={manufacturers}
          selectedManufacturer={selectedManufacturer}
          onManufacturerChange={setSelectedManufacturer}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
        />
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredDevices.length} of {devices.length} devices
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SortAsc className="h-4 w-4" />
            <span>
              Sorted by {sortBy === "popular" ? "popularity" : sortBy}
            </span>
          </div>
        </div>
        {filteredDevices.length > 0 ? (
          <DeviceGrid
            devices={filteredDevices}
            onDeviceUpdate={handleDeviceUpdate}
          />
        ) : (
          <DeviceEmptyState
            searchQuery={searchQuery}
            selectedManufacturer={selectedManufacturer}
            categoryName={categoryName}
            onClearFilters={clearFilters}
          />
        )}
      </main>
    </div>
  );
}
