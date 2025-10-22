"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryStats } from "@/types/convex";
import {
  ChevronRight,
  Disc,
  Fan,
  Gamepad2,
  Projector,
  Radio,
  Tv,
  Volume2,
  Wind,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryGridProps {
  categories: CategoryStats[];
}

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  TV: Tv,
  "Air Conditioner": Wind,
  "Sound System": Volume2,
  "Blu-ray Player": Disc,
  "DVD Player": Disc,
  "Cable Box": Radio,
  "Satellite Receiver": Radio,
  "Streaming Device": Tv,
  Projector: Projector,
  Fan: Fan,
  Other: Gamepad2,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((category) => {
        const IconComponent = categoryIcons[category.name] || Gamepad2;
        const topBrands = Array.from(
          new Set(
            category.devices.map((device) => device.manufacturer).slice(0, 3),
          ),
        );

        return (
          <div
            key={category.name}
            onClick={() =>
              router.push(
                `/category/${encodeURIComponent(category.name.toLowerCase())}`,
              )
            }
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                router.push(
                  `/category/${encodeURIComponent(category.name.toLowerCase())}`,
                );
            }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-300 hover:shadow-primary/5 dark:hover:shadow-primary/10 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Devices</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Codes</span>
                  <Badge variant="outline">{category.totalCodes}</Badge>
                </div>
                {category.effectiveness > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Effectiveness</span>
                    <Badge
                      variant={
                        category.effectiveness >= 80 ? "default" : "secondary"
                      }
                    >
                      {category.effectiveness}%
                    </Badge>
                  </div>
                )}
                {topBrands.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">
                      Popular Brands
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {topBrands.map((brand) => (
                        <Badge
                          key={brand}
                          variant="outline"
                          className="text-xs"
                        >
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
