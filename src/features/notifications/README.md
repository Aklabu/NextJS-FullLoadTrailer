# Notifications System — Design Documentation

## Overview

Minimal, clean notification panel design for in-app notifications. Triggered by bell icon in navbar with unread badge count.

---

## File Structure

```
src/features/notifications/
├── README.md                      # This file
├── index.ts                       # Public exports
├── types.ts                       # TypeScript interfaces
├── NotificationBell.tsx           # Bell icon + badge (navbar component)
├── NotificationPanel.tsx          # Dropdown panel with tabs
└── api/
    └── notificationsApi.ts        # API client functions
```

---

## Components

### 1. **NotificationBell** (Navbar Integration)

**Location:** Navbar, right side (next to profile dropdown)

**Features:**
- Bell icon with hover effect
- Unread count badge (orange, top-right corner)
- Click to toggle panel
- Auto-polls unread count every 30s
- Close on outside click or Escape key

**States:**
- No unread: Plain bell icon
- Has unread: Bell + orange badge with count
- Badge shows "99+" if count > 99

**Usage:**
```tsx
import { NotificationBell } from '@/features/notifications';

<NotificationBell />
```

---

### 2. **NotificationPanel** (Dropdown)

**Dimensions:** 420px × max 600px

**Layout:**
- **Header:** Title + "Mark all read" button
- **Tabs:** All | Bids | Messages | Reviews
- **List:** Scrollable notification items
- **Footer:** Link to notification settings

**Features:**
- 4 filter tabs (active = orange bg + white text)
- Pagination (10 per page, "Load more" button)
- Empty states per tab
- Hover actions: Mark read (✓) + Delete (×)
- Unread items: orange bg (`#fff7ed`)
- Read items: white bg
- Unread indicator: orange dot (top-right)

**Item Structure:**
```
[Icon] Title                      [•]  ← unread dot
       Body (max 2 lines)
       Time · Actor name
       [✓] [×]  ← hover actions
```

---

## Notification Types

| Type | Icon | Category | Priority | Example |
|------|------|----------|----------|---------|
| `bid_placed` | 💰 | bids | normal | "New bid: $2,500" |
| `bid_countered` | 🔄 | bids | high | "Counter offer: $2,800" |
| `counter_accepted` | ✅ | bids | normal | "Counter accepted" |
| `review_received` | ⭐ | reviews | normal | "New review (4.5 stars)" |
| `new_message` | 💬 | messages | normal | "New message from..." |

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications/` | List (paginated, 10/page) |
| GET | `/api/notifications/unread-count/` | Badge counts |
| PATCH | `/api/notifications/<id>/read/` | Mark one read |
| POST | `/api/notifications/read-all/` | Mark all read |
| DELETE | `/api/notifications/<id>/` | Delete one |
| GET | `/api/notifications/preferences/` | Get settings |
| PATCH | `/api/notifications/preferences/` | Update settings |

---

## Data Flow

### On Mount (NotificationBell)
1. Fetch unread count: `GET /api/notifications/unread-count/`
2. Display badge if count > 0
3. Poll every 30s

### On Panel Open
1. Fetch notifications: `GET /api/notifications/?category=all&page=1`
2. Display list (10 items)
3. Show "Load more" if `has_more === true`

### On Notification Click
1. Mark as read: `PATCH /api/notifications/<id>/read/`
2. Navigate to target (load, conversation, profile)
3. Update local state (remove orange bg + dot)

### On "Mark all read"
1. Call: `POST /api/notifications/read-all/` (with category filter)
2. Update all items in current tab to `is_read: true`

### On Delete
1. Call: `DELETE /api/notifications/<id>/`
2. Remove from local state

---

## Design Tokens

### Colors
- **Brand orange:** `#fc3f07` (active tab, badge, unread dot)
- **Orange hover:** `#d93506`
- **Unread bg:** `#fff7ed` (light orange)
- **Border:** `#e8e0d6`
- **Hover bg:** `#fafaf8`

### Typography
- **Title (unread):** 14px, font-semibold, neutral-900
- **Title (read):** 14px, font-medium, neutral-700
- **Body:** 12px, neutral-500, max 2 lines
- **Time/Actor:** 10px, neutral-400

### Spacing
- **Panel:** 16px padding
- **Item:** 12px vertical padding
- **Tabs:** 12px horizontal padding

---

## Accessibility

- Bell button: `aria-label` with unread count
- Panel: `role="dialog"` + `aria-modal="true"`
- Unread dot: `aria-label="Unread"`
- Keyboard: Escape closes panel
- Focus trap: Panel stays open until dismissed

---

## Integration with Navbar

Add to `NavbarClient.tsx` (authenticated state):

```tsx
import { NotificationBell } from '@/features/notifications';

<div className="flex items-center gap-3">
  <NotificationBell />  {/* Add here */}
  <ProfileDropdown ... />
</div>
```

---

## Limits & Rules

- **10 notifications per page**
- **Max 5 pages** (50 total per user)
- **Auto-pruned** by backend when limit exceeded
- **Polling interval:** 30 seconds
- **Badge max:** "99+"

---

## Future Enhancements

- Real-time updates via WebSocket (instead of polling)
- Push notifications (browser API)
- Sound on new notification
- Notification grouping (e.g., "3 new bids")
- Rich actions (Accept/Reject bid inline)

---

## Sample API Response

```json
{
  "status": "success",
  "message": "Notifications retrieved",
  "data": {
    "notifications": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "type": "bid_placed",
        "category": "bids",
        "title": "New bid: $2,500",
        "body": "ABC Trucking placed a bid on your load to Dallas",
        "priority": "normal",
        "is_read": false,
        "created_at": "2024-01-15T14:30:00Z",
        "target": {
          "kind": "load",
          "id": "660e8400-e29b-41d4-a716-446655440001"
        },
        "meta": {
          "amount": "2500",
          "job_id": "FTL-2026-1234"
        },
        "actor": {
          "id": "770e8400-e29b-41d4-a716-446655440002",
          "name": "ABC Trucking"
        }
      }
    ],
    "has_more": true,
    "total": 23
  }
}
```

---

**Status:** ✅ Design Complete — Ready for Backend Integration
