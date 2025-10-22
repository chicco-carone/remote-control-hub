// hooks/use-current-user.ts
import { api } from "@/convex/_generated/api";
import Logger from "@/lib/logger";
import { useConvexAuth, useQuery } from "convex/react";

const logger = new Logger("useCurrentUser");

export function useCurrentUser(lastUpsert?: number) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.queries.viewer, { lastUpsert });

  logger.debug("useCurrentUser state", {
    isLoading,
    isAuthenticated,
    user,
    userType: typeof user,
    userFields: user
      ? {
          name: user.name,
          clerkId: user.clerkId,
          username: user.username,
          image: user.image,
        }
      : null,
  });

  return {
    isLoading: isLoading || (isAuthenticated && user === undefined),
    isAuthenticated: isAuthenticated && user !== null,
    user,
  };
}
