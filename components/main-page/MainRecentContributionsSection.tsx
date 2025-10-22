// MainRecentContributionsSection.tsx

import { RecentContributions } from "@/components/recent-contributions";
import type { ConvexDevice } from "@/types/convex";
import { Users } from "lucide-react";

/**
 * Renders the recent contributions section for the main page.
 */
export interface MainRecentContributionsSectionProps {
  recentDevices: ConvexDevice[];
}

export default function MainRecentContributionsSection({
  recentDevices,
}: MainRecentContributionsSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Recent Contributions
          </h2>
          <p className="text-muted-foreground">
            Latest devices added by the community
          </p>
        </div>
      </div>
      <RecentContributions devices={recentDevices} />
    </section>
  );
}
