/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as crons from "../crons.js";
import type * as internal_purge from "../internal/purge.js";
import type * as mutations_clearDb from "../mutations/clearDb.js";
import type * as mutations_codes from "../mutations/codes.js";
import type * as mutations_devices from "../mutations/devices.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations_votes from "../mutations/votes.js";
import type * as purge from "../purge.js";
import type * as queries from "../queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  "internal/purge": typeof internal_purge;
  "mutations/clearDb": typeof mutations_clearDb;
  "mutations/codes": typeof mutations_codes;
  "mutations/devices": typeof mutations_devices;
  "mutations/users": typeof mutations_users;
  "mutations/votes": typeof mutations_votes;
  purge: typeof purge;
  queries: typeof queries;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
