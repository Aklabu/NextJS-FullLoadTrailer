# Dashboard Feature

Minimal, role-aware dashboard for authenticated users. Aggregates data from existing APIs to show key metrics, quick actions, and recent activity.

## Structure

```
src/features/dashboard/
├── api/
│   └── dashboardApi.ts          # Aggregates data from existing APIs
├── ActivityFeed.tsx              # Recent activity timeline
├── DashboardContent.tsx          # Main dashboard component
├── QuickActionCard.tsx           # Action button cards
├── StatCard.tsx                  # Metric display cards
├── roleConfig.ts                 # Role-specific configurations
├── types.ts                      # TypeScript interfaces
├── index.ts                      # Public exports
└── README.md                     # This file
```

## Data Sources

The dashboard aggregates data from existing APIs:

### Shipper/Broker
- **Stats:** `GET /api/marketplace/my-loads/` → total, active_bids, booked, completed
- **Notifications:** `GET /api/notifications/unread-count/` → unread count

### Carrier
- **Stats:** `GET /api/marketplace/carrier/my-bids/` → active, won counts
- **Notifications:** `GET /api/notifications/unread-count/` → unread count

### Recent Activity (All Roles)
- **Activity Feed:** `GET /api/notifications/` → recent 5 notifications mapped to activity items

## Role-Based Content

### Shipper/Broker Stats
- Total Loads (📦)
- Active Bids (⚡)
- Booked (✅)
- Completed (🏁)

### Carrier Stats
- Active Bids (⚡)
- Won Bids (🎯)
- Completed Jobs (✅)
- Board Posts (📋)

## Quick Actions

Each role gets 4 quick action cards with role-specific workflows.

### Shipper
1. **Post a Load** (primary - orange)
2. My Loads
3. Browse Board
4. Messages

### Broker
1. **Post a Load** (primary - orange)
2. Pipeline Dashboard
3. My Loads
4. Messages

### Carrier
1. **Browse Loads** (primary - orange)
2. My Bids
3. Post Capacity
4. Messages

## Recent Activity

Activity feed pulls from the notifications API and maps notification types to activity types:

**Notification Type → Activity Type:**
- `bid_placed`, `bid_countered`, `counter_accepted` → `bid` (⚡)
- `new_message` → `message` (💬)
- Others → `notification` (🔔)

**Activity links** are built dynamically based on notification target:
- `load` → `/marketplace/loads/:id`
- `conversation` → `/messages/:id`
- `bid` → `/marketplace/carrier/my-bids`
- `review` → `/profiles/:actorId/reviews`

## Design

- **Minimal**: Clean card-based layout, emoji icons
- **Responsive**: 1/2/4 column grids adapt to screen size
- **Accessible**: ARIA labels, semantic HTML
- **Fast**: Loading skeletons, parallel data fetching
- **Resilient**: Graceful error handling, shows zeros on API failures

## Usage

```tsx
import { DashboardContent } from '@/features/dashboard';

export default function DashboardPage() {
  return <DashboardContent />;
}
```

The component:
- Fetches user profile from `/api/accounts/me/`
- Aggregates stats and activity based on user role
- Handles loading, error states, and auth redirects
- No separate backend endpoint required — reuses existing APIs
