// MainPopularDevicesSection.tsx

import { PopularDevices } from "@/components/popular-devices";
import type { ConvexDevice } from "@/types/convex";
import { TrendingUp } from "lucide-react";

/**
 * Renders the most popular devices section for the main page.
 */
export interface MainPopularDevicesSectionProps {
  popularDevices: ConvexDevice[];
}

export default function MainPopularDevicesSection({
  popularDevices,
}: MainPopularDevicesSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Most Popular</h2>
          <p className="text-muted-foreground">
            Devices with the most community votes
          </p>
        </div>
      </div>
      <PopularDevices devices={popularDevices} />
    </section>
  );
}
