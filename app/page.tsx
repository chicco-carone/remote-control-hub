"use client";

import MainCategorySection from "@/components/main-page/MainCategorySection";
import MainEmptySearchState from "@/components/main-page/MainEmptySearchState";
import MainHeaderBar from "@/components/main-page/MainHeaderBar";
import MainPopularDevicesSection from "@/components/main-page/MainPopularDevicesSection";
import MainRecentContributionsSection from "@/components/main-page/MainRecentContributionsSection";
import MainSearchFilterBar from "@/components/main-page/MainSearchFilterBar";
import type { CategoryStats, ConvexDevice } from "@/types/convex";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const devicesQuery = useQuery(api.queries.getAllDevices);
  const devices = useMemo(() => devicesQuery || [], [devicesQuery]);
  const categoryStatsQuery = useQuery(api.queries.getCategoryStats);
  const categoryStats = useMemo(
    () => categoryStatsQuery || [],
    [categoryStatsQuery],
  );

  const categories = categoryStats;

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories.filter(
      (category: CategoryStats) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.devices.some(
          (device: ConvexDevice) =>
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.manufacturer
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        ),
    );
  }, [categories, searchQuery]);

  const popularDevices = useMemo(() => {
    return [...devices]
      .sort((a, b) => {
        const aTotal = a.totalVotes.thumbsUp + a.totalVotes.thumbsDown;
        const bTotal = b.totalVotes.thumbsUp + b.totalVotes.thumbsDown;
        return bTotal - aTotal;
      })
      .slice(0, 6);
  }, [devices]);

  const recentDevices = useMemo(() => {
    return [...devices]
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .slice(0, 4);
  }, [devices]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <MainHeaderBar />

      <main className="container mx-auto px-4 py-8">
        <MainSearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        <div className="space-y-12">
          <MainCategorySection
            filteredCategories={filteredCategories}
            searchQuery={searchQuery}
          />

          {!searchQuery && (
            <>
              <MainPopularDevicesSection popularDevices={popularDevices} />
              <MainRecentContributionsSection recentDevices={recentDevices} />
            </>
          )}
        </div>

        {searchQuery && filteredCategories.length === 0 && (
          <MainEmptySearchState setSearchQuery={setSearchQuery} />
        )}
      </main>
    </div>
  );
}
