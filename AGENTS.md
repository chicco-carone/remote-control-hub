# AGENTS.md - AI Coding Agent Guidelines

## Project Overview

Next.js 16 app with Convex backend, Clerk authentication, and ESPHome integration for IR remote control code sharing.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Convex, Clerk, ESPHome

---

## Build, Lint, Test Commands

### Development

```bash
bun dev                # Start both frontend (Next.js) and backend (Convex)
bun dev:frontend       # Start only Next.js dev server with Turbopack
bun dev:backend        # Start only Convex dev server
bun dev:tunnel         # Start ngrok tunnel for testing
```

### Build & Production

```bash
bun build              # Build with Turbopack
bun start              # Start production server
```

### Code Quality

```bash
bun lint               # ESLint with Next.js rules
bun format             # Prettier with automatic import organization
```

### Testing

```bash
bun test               # Run all Jest tests with jsdom
bun test <file-path>   # Run a single test file
# Example: bun test __tests__/hooks/use-code-validation.test.ts
```

---

## Code Style Guidelines

### Import Organization

- Auto-organized by Prettier plugin
- Order: React/Next → External libraries → Internal (`@/`) → Relative imports
- Use absolute imports with `@/` prefix for all internal modules

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### TypeScript

- **Strict mode enabled** - no implicit `any`
- Use explicit return types for exported functions
- Prefer interfaces for object shapes, types for unions/intersections
- Use Zod schemas for runtime validation (see `types/validation.ts`)

```typescript
// Good
export function getDevice(id: string): Promise<Device | null> { ... }

// Bad
export function getDevice(id) { ... }
```

### Naming Conventions

- **Files:** kebab-case (`device-card.tsx`, `use-clipboard.ts`)
- **Components:** PascalCase (`DeviceCard`, `VoteButtons`)
- **Functions/Variables:** camelCase (`getUserIdentity`, `deviceId`)
- **Constants:** UPPER_SNAKE_CASE or camelCase for config objects
- **Types/Interfaces:** PascalCase (`Device`, `ESPHomeCode`)
- **Hooks:** `use` prefix (`useCurrentUser`, `useDeviceState`)

### Component Structure

```typescript
"use client"; // Only when needed (state, effects, event handlers)

import statements...

interface ComponentProps {
  prop: Type;
}

export function Component({ prop }: ComponentProps) {
  // 1. Hooks
  const router = useRouter();
  const [state, setState] = useState();

  // 2. Queries/Mutations
  const data = useQuery(api.queries.getData);
  const mutation = useMutation(api.mutations.update);

  // 3. Event handlers
  const handleClick = () => { ... };

  // 4. Render
  return <div>...</div>;
}
```

### Formatting

- **2 spaces** for indentation
- **Double quotes** for strings
- **No semicolons** (Prettier removes them)
- Max line length: Let Prettier decide (typically ~80-100 chars)
- Trailing commas in multiline

### Error Handling

```typescript
// In Convex mutations/queries
if (!identity) {
  throw new Error("Authentication required");
}

// In components
try {
  await mutation({ ... });
  toast.success("Success message");
} catch (error) {
  toast.error(error instanceof Error ? error.message : "An error occurred");
}
```

---

## Architecture Patterns

### Authentication

```typescript
// Always check auth in Convex functions
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Authentication required");

// Fetch user from DB
const user = await ctx.db
  .query("users")
  .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
  .first();
```

### Data Fetching with Convex

```typescript
// Pattern: Fetch main entities → enrich with related data
const devices = await ctx.db.query("devices").collect();

const devicesWithCodes = await Promise.all(
  devices.map(async (device) => {
    const codes = await ctx.db
      .query("codes")
      .withIndex("by_device", (q) => q.eq("deviceId", device._id))
      .collect();

    const author = await ctx.db.get(device.authorId);
    return { ...device, codes, author };
  }),
);
```

### Validation

```typescript
// 1. Define Zod schema in types/validation.ts
export const deviceSchema = z.object({
  name: z.string().trim().min(1, "Device name is required"),
  manufacturer: z.string().trim().min(1, "Manufacturer is required"),
});

// 2. Validate in mutation
const result = deviceSchema.safeParse(args);
if (!result.success) {
  throw new Error(result.error.issues.map((e) => e.message).join(", "));
}
```

### Soft Deletes

- Devices and codes are soft-deleted
- Snapshots stored in `deleted_devices` and `deleted_codes` tables
- Retention: 15 days, then purged by cron job
- Check ownership or admin role before deletion

### UI Components

- Use shadcn/ui components from `components/ui/`
- Combine classes with `cn()` utility from `lib/utils.ts`
- Responsive design with `md:` breakpoints (mobile-first)

```typescript
<Card className={cn("hover:shadow-lg", className)}>
```

### Toast Notifications

```typescript
import { toast } from "sonner";

toast.success("Device created successfully");
toast.error("Failed to save");
```

---

## Key Files & Directories

```
├── app/                      # Next.js App Router pages
│   ├── api/webhooks/clerk/   # Clerk webhook handler for user sync
│   └── providers.tsx         # App-wide providers (Clerk, Convex, Theme)
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   └── add-device/           # Device creation flow
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema
│   ├── queries.ts            # Data queries
│   ├── mutations/            # Data mutations (devices, codes, votes, users)
│   ├── crons.ts              # Scheduled jobs (purge deleted items)
│   └── internal/purge.ts     # Internal purge logic
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities
│   ├── esphome-api.ts        # ESPHome SSE connection
│   ├── convex-server-client.ts # Server-side Convex client
│   └── utils.ts              # Common utilities (cn)
├── types/                    # TypeScript types & Zod schemas
│   ├── validation.ts         # Zod validation schemas
│   └── *.ts                  # Type definitions
└── __tests__/                # Jest tests
```

---

## Common Patterns

### Creating a New Page

1. Add file in `app/[route]/page.tsx`
2. Use Server Components by default
3. Add `"use client"` only if using hooks/state
4. Fetch data with Convex `useQuery` (client) or `preloadQuery` (server)

### Creating a New Convex Function

1. Add to appropriate file in `convex/` (queries.ts, mutations/)
2. Define args with `v` validators
3. Check authentication if required
4. Validate with Zod if accepting complex input
5. Return data (queries) or IDs (mutations)

### Adding a New Form

1. Define Zod schema in `types/validation.ts`
2. Use `react-hook-form` with `@hookform/resolvers/zod`
3. Create mutation in `convex/mutations/`
4. Handle submission with `useMutation`
5. Show toast on success/error

---

## Important Notes

- **Never skip authentication checks** in mutations/queries that require auth
- **Always use Zod validation** for user input
- **Check ownership** before delete/update operations
- **Use soft-delete pattern** for devices and codes (15-day retention)
- **Test responsive layouts** - mobile-first approach
- **Use TypeScript strictly** - no `any` types
- **Convex subscriptions** for real-time updates
- **Webhook handling**: Use discriminated union narrowing on `WebhookEvent.type`
- **ESPHome**: Validate protocol parameters against known schemas

---

## Testing Strategy

- **Unit tests:** Utilities, validation logic
- **Component tests:** React components with jsdom
- **Integration tests:** Convex functions
- **Location:** `__tests__/` directory mirrors source structure
- **Run single test:** `bun test <path-to-test-file>`

---

## From copilot-instructions.md

### Data Model

- Devices → Codes → Votes, with user relationships
- Soft-delete snapshots: `deleted_devices`, `deleted_codes` (retention 15 days)

### Clerk Webhook User Sync

- Events: `user.created`, `user.updated`, `user.deleted`
- Handler: `app/api/webhooks/clerk/route.ts`
- Field mapping: `name` from full name or email local-part, `username` optional

### ESPHome Integration

- SSE connections in `lib/esphome-api.ts`
- Real-time IR code capture and validation
- Connection pooling with reconnection logic
