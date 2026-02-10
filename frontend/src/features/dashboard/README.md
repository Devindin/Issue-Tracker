# Dashboard API

This module contains all dashboard-specific API endpoints using RTK Query.

## Structure

```
features/dashboard/
  └── dashboardApi.ts    # Dashboard API endpoints
```

## Endpoints

### `useGetDashboardStatsQuery`
Fetches dashboard statistics including counts for each issue status.

**Returns:**
```typescript
{
  stats: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    total: number;
  }
}
```

**Usage:**
```typescript
import { useGetDashboardStatsQuery } from "../features/dashboard/dashboardApi";

const { data, isLoading, isError } = useGetDashboardStatsQuery();
const stats = data?.stats;
```

### `useGetRecentIssuesQuery`
Fetches recent issues with optional limit parameter.

**Parameters:**
- `limit` (optional): Number of issues to return (default: 10)

**Returns:**
```typescript
{
  issues: Issue[];
  total: number;
}
```

**Usage:**
```typescript
import { useGetRecentIssuesQuery } from "../features/dashboard/dashboardApi";

const { data, isLoading, isError } = useGetRecentIssuesQuery({ limit: 10 });
const issues = data?.issues;
```

## Features

- **Automatic Stats Calculation**: Stats are calculated on the server side from the issues data
- **Console Logging**: All API calls are logged for debugging purposes
- **Error Handling**: Comprehensive error transformation and logging
- **Cache Management**: Uses RTK Query's built-in caching with "Issue" tags
- **Type Safety**: Full TypeScript support with proper interfaces

## Implementation Details

Both endpoints use the base `/issues` API endpoint and transform the response data:
- `getDashboardStats` calculates statistics from all issues
- `getRecentIssues` slices the issues array to return only recent items

The endpoints are integrated with the global API slice and share the same cache tags, ensuring automatic updates when issues are created, updated, or deleted.
