import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "purge expired deleted snapshots",
  "0 2 * * *",
  internal.purge.purgeExpiredSnapshots,
);

export default crons;
