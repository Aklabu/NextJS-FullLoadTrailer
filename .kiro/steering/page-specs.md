---
inclusion: always
---

# FullTrailerLoad — Frontend Page Specifications

**Backend:** Django REST Framework + Django Admin
**Scope:** Tier 1 (Community / Bulletin Board) + Tier 2 (Marketplace) — Tier 3 (Operations/Driver) deferred.
**Auth:** JWT-based, matching the existing MovingWyze Django pattern (`/api/accounts/login/`, token refresh).

---

## Route Groups & Layouts

| Route group | Layout | Navbar + Footer |
|---|---|---|
| `(marketing)` | `MarketingLayout` | Yes |
| `(public)` | `PublicLayout` | Yes |
| `(authenticated)` | `AppLayout` — `bg-[#fdf6ee]` warm cream | Yes |
| `auth/` | `AuthLayout` — bare shell | No |

---

## A. Public / Marketing

### 1. Homepage `/`
- **Access:** Public
- **Route group:** `(marketing)`
- **Purpose:** Explain the platform, drive sign-ups, differentiate from a plain load board
- **Key sections:** Hero with background truck image + "Track a Move" widget (public job ID search), stats bar (2,400+ moves/mo, 99.4% verified, 14-min avg counteroffer), tier comparison teaser (Bulletin Board free vs Marketplace), CTA banner, footer
- **Primary actions:** Sign Up → `/auth/signup`, Login → `/auth/login`, Track a Move (inline widget) → `/tracking?job_id=...`
- **Feature file:** `src/features/public/homepage/`

### 2. How It Works `/how-it-works`
- **Access:** Public
- **Purpose:** Explain the platform flow per role and tier structure
- **Key sections:** Hero with role toggle (Moving Companies & Brokers [DEMAND] / HHG Carriers & Owner-Operators [SUPPLY]), visual flow diagram (post → bid → accept/counter → booking), tiers explainer, FAQ accordion, Sign Up CTA
- **Primary actions:** Role toggle (client-side visual only), Sign Up at bottom
- **Feature file:** `src/features/public/how-it-works/`

### 3. Pricing `/pricing`
- **Access:** Public
- **Purpose:** Show Tier 1 (Community) vs Tier 2 (Marketplace) features and cost side by side
- **Key sections:** `PricingCards` (two equal-height cards), `FeatureMatrix` (comparison table), `FaqSection`, `ZeroRiskBanner`, `CtaSection`
- **Tier 1 — Community features:** Real-time chat & community feed, post loads and available trucks, private messaging, share photos and documents, search and filter by category, basic member screening, DOT/MC info (required), COI (basic/required), notifications. No bidding, matching, tracking, or transactions.
- **Tier 2 — Marketplace features:** Everything in Tier 1 + structured load listings, bidding, carrier/mover matching, advanced & third-party verification, DOT/MC full verification + COI, document management, shipment tracking, booking, transactions, closing sheet
- **Primary actions:** "Get Started with Tier 1 →" → `/auth/signup`, "Get Started with Tier 2 →" → `/auth/signup?tier=2`
- **Notes:** Pricing amounts are TBD with client — built data-driven/configurable, not hardcoded. Show "Configurable" as placeholder.
- **Feature file:** `src/features/public/pricing/`

### 4. Contact / Support `/contact`
- **Access:** Public
- **Purpose:** General inquiries, support requests
- **Key sections:** Contact form — Full Name, Work Email, Company Name & Role (optional), Urgency Level toggle (Normal / Urgent Spot Issue), Inquiry Category dropdown (Account & SAFER/COI Verification, Rate Confirmation Dispute, Billing & Escrow, Technical Issue), Message Description (max 1500 chars), Supporting Documentation file upload (PDF/PNG/JPG up to 25MB)
- **Primary actions:** Submit form
- **States:** `idle | submitting | success | error`. Success shows "respond within 2 business hours" confirmation.
- **API:** `POST /support/contact/`
- **Feature file:** `src/features/public/contact/`

### 5. Public Tracking `/tracking`
- **Access:** Public, no login required
- **Purpose:** Let anyone check shipment status by Job ID
- **Key sections:** Search input (Job ID), result card (status, route, progress bar, milestones, equipment info), not-found state, support banner
- **Primary actions:** Search by Job ID
- **States:** `idle | not_found | in_transit | delivered`
- **API:** `GET /api/tracking/search/?job_id=...`
- **Notes:** Job ID format: `FTL-NNNN-XXXX`. Field naming is intentionally compatible with MovingWyze `LoadSheetHeader`/`LoadSheetTask` for future sync.
- **Feature file:** `src/features/public/tracking/`

---

## B. Auth & Onboarding

### 6. Role Selection `/auth/signup`
- **Access:** Public
- **Purpose:** Entry point to registration — choose account type
- **Key sections:** Three role cards: Shipper / Moving Company (DEMAND badge, orange accent), Freight Broker (INTERMEDIARY badge, teal accent), Carrier / Owner-Operator (SUPPLY badge, dark accent). Each has icon, title, description, detail line, "Select & Continue →" CTA. "Log in" link top-right.
- **Primary actions:** Select role → `/auth/register?role={role}`
- **Feature file:** `src/features/auth/signup/RoleSelectionPage.tsx`

### 7. Login `/auth/login`
- **Access:** Public
- **Purpose:** Authenticate existing users
- **Key sections:** Two-panel layout — left panel: dark background with brand stats (logo, value prop, 3 stats); right panel: login form (email, password with show/hide toggle, "Forgot password?" link, submit button, "Create an account" link)
- **Primary actions:** Login
- **States:** Loading, invalid credentials error (red banner with `data.detail`), account-not-verified (amber banner → "Check status" link to `/auth/verify-status`). Unverified triggered by `res.status === 403` or `data?.code === 'account_not_verified'`.
- **API:** `POST /api/accounts/login/` (JWT). On success: store tokens, redirect to `/dashboard`.
- **Feature file:** `src/features/auth/login/LoginPage.tsx`

### 8. Forgot Password `/auth/forgot-password`
- **Access:** Public
- **Purpose:** Password recovery via OTP
- **Key sections:** Step 1 — enter email; Step 2 — enter OTP code; Step 3 — set new password
- **Primary actions:** Send OTP, Verify OTP, Reset Password
- **States:** Loading, OTP sent confirmation, invalid/expired OTP error, success
- **API:** `POST /api/accounts/password/forgot/`, `POST /api/accounts/password/reset/`

### 9. Registration `/auth/register`
- **Access:** Public (post role-selection, `?role=` param pre-fills)
- **Purpose:** Collect company identity and compliance info
- **Key sections:** 4-step form with `ProgressSteps` indicator:
  1. **Company Info** — company name (required), email (required), phone (required), address line 1 (required), address line 2 (optional), city/state/zip (required), country (default US)
  2. **Role Fields + Tier selection** — Basic vs Advanced toggle. Carrier + Advanced: DOT number (required), MC number (required). Broker/Shipper + Advanced: business license number (required), state of incorporation (required). Basic tier: no extra fields.
  3. **Documents** — file upload (insurance, authority docs). Skippable for Basic tier.
  4. **Password** — password (min 8 chars) + confirm. Password strength meter (Weak/Fair/Good/Strong).
- **Primary actions:** Next / Back between steps, final Submit
- **States:** Per-field validation on each step advance. Submit states: `idle | submitting | error`. Upload progress per file.
- **API:** `POST /api/accounts/register/` payload: `{ role, tier, company_name, email, phone, address, dot_number?, mc_number?, business_license?, state_of_incorporation?, password }`
- **Success:** → `/auth/verify-status`
- **Feature file:** `src/features/auth/register/`

### 10. Verification Status `/auth/verify-status`
- **Access:** Logged in, any verification state
- **Purpose:** Show review status, block marketplace access until approved
- **Key sections:** Status banner (Pending / Verified / Rejected / Needs More Info / Basic / Unverified), "what happens next" steps, action buttons, contact support link
- **Status behaviours:**

| Status | Banner colour | Action |
|---|---|---|
| `pending` | Amber | "Refresh status" link, 1-2 business days message |
| `verified` | Emerald | Auto-redirect to `/dashboard` after 2.5s |
| `basic` | Sky | "Go to Bulletin Board →" |
| `rejected` | Red | Shows `rejectionReason` + "Correct & resubmit" → `/auth/register` |
| `needs_info` | Orange | Shows `infoRequested` + "Upload requested documents" |
| `unverified` | Grey | "Complete registration →" |

- **API:** `GET /api/accounts/me/verification-status/` returns `{ status, rejectionReason?, infoRequested?, submittedAt?, reviewedAt? }`. `401` → redirect to login.
- **Feature file:** `src/features/auth/verify-status/VerifyStatusPage.tsx`

### 11. Onboarding Walkthrough (Modal)
- **Access:** Logged in, `hasSeenOnboarding === false` (first login after verification)
- **Purpose:** Explain tier structure and guide first action
- **Key sections:** 4-slide modal carousel:
  1. The Bulletin Board — mock post card visual, "Basic verification gets you here"
  2. The Marketplace — mock bid UI visual, "Advanced verification required"
  3. Bidding in 4 steps — flow diagram: post → bid → accept/counter → booking
  4. Role-aware CTA: "Start finding loads" (carrier → `/marketplace/carrier/loads`) or "Post your first load" (shipper/broker → `/board`)
- **Primary actions:** Skip (×), Navigate (← →), step dots, Finish / CTA on last slide
- **Keyboard:** Escape to dismiss, arrow keys to navigate
- **States:** One-time, dismissible, focus-trapped dialog
- **API:** `POST /api/accounts/me/onboarding-seen/` (best-effort, fire-and-forget on dismiss)
- **Feature file:** `src/features/auth/onboarding/OnboardingModal.tsx`

---

## C. Account & Profile

### 12. My Profile / Company Settings `/profile`
- **Access:** Logged in
- **Purpose:** Edit company info, contact details
- **Key sections:** Page header (company name + `VerificationBadge` + role). Four `SectionCard` components:
  1. Company information (editable): company name, email, phone, address line 1, city/state/zip, website. PATCH with "Saved ✓" feedback (clears after 3s).
  2. Password & security: "Change password" → `/auth/forgot-password`
  3. Verification status: `VerificationBadge` + status description + "Check status" link
  4. Account: Logout button
- **Primary actions:** Save changes (PATCH), Logout
- **States:** Saving, saved, error
- **API:** `PATCH /api/accounts/me/`
- **Feature file:** `src/features/account/profile/ProfilePage.tsx`

### 13. Subscription & Tier Upgrade `/subscription`
- **Access:** Logged in
- **Purpose:** View current plan, upgrade to marketplace
- **Key sections:** Current plan card (plan name + feature list), 9-feature comparison table (Bulletin Board vs Marketplace), billing history table, upgrade confirmation modal
- **Primary actions:** Upgrade Tier → modal → routes to `/contact?subject=Marketplace+Upgrade`
- **States:** Current tier highlighted. `CURRENT_TIER` is from auth context (TODO: not yet wired, hardcoded `'basic'`).
- **Notes:** Payments/escrow flow TBD with client. Pricing amounts TBD — built configurable.
- **Feature file:** `src/features/account/subscription/SubscriptionPage.tsx`

### 14. Public-Facing Profile `/profiles/[id]`
- **Access:** Logged in, any role
- **Purpose:** Trust and reputation page — show verification badge and ratings before a bid/deal
- **Key sections:** Identity card (company name, `VerificationBadge`, role, avg rating, job count, member since), action buttons ("Message" → `/messages/new?recipient=:id`, "View active capacity/loads"), reviews summary (rating + bar chart per star), recent reviews list, "See all reviews →" link
- **Primary actions:** Message, view loads/capacity
- **States:** No reviews yet, profile not verified
- **API:** `GET /api/profiles/:id/`
- **Feature file:** `src/features/account/public-profile/PublicProfilePage.tsx`

### 15. Notification Preferences `/notifications`
- **Access:** Logged in
- **Purpose:** Control email/in-app notification settings
- **Key sections:** Toggle list — new bid, counteroffer, message received, booking confirmed, verification update, etc.
- **Primary actions:** Save preferences
- **States:** Save confirmation
- **Feature file:** `src/features/account/notifications/`

---

## D. Tier 1 — Bulletin Board

### 16. Board Feed `/board`
- **Access:** Logged in, at least Basic verification
- **Purpose:** Browse informal community load and capacity posts
- **Key sections:** Page header with "TIER 1 · BULLETIN BOARD" badge + "Create Post" CTA. FilterBar (origin text, destination text, equipment dropdown, pickup from date, pickup to date, post type dropdown). Results count. 2-column post card grid (6 per page). Skeleton loader. Empty state with "Clear filters" + "Create a post" CTAs. Pagination.
- **FilterBar equipment options:** Any equipment | Box Truck | Moving Trailer | Dry Van (Side Door)
- **FilterBar post type options:** All posts | Load Available | Truck / Trailer Available
- **PostCard sections:** Post type pill (orange / teal), route (origin → destination), meta row (cu ft, pickup date, equipment), 2-line description, poster company + `VerificationBadge` + "View" + "Contact Poster" CTAs
- **Primary actions:** Filter (client-side with 500ms simulated delay), Create Post, View, Contact Poster
- **States:** Loading (skeleton), empty (no matches), results
- **API:** `GET /api/board/posts/`
- **Feature file:** `src/features/bulletin-board/BoardFeedPage.tsx`

### 17. Create Post `/board/create`
- **Access:** Logged in, Basic verification
- **Purpose:** Publish a bulletin board post
- **Key sections:** Post type toggle (Load Available 📦 / Truck & Trailer Available 🚚), origin (required), destination (required), cubic feet (required, positive number), equipment type (dropdown), pickup date (required), description (required, min 20 chars, hint: "no full addresses or detailed inventory lists"). Submit + Cancel.
- **Primary actions:** Publish
- **States:** Field-level validation with `role="alert"` errors. `idle | submitting | error`. Success → `/board/:id` or `/board`.
- **API:** `POST /api/board/posts/` payload: `{ post_type, origin, destination, cubic_feet, equipment_type, pickup_date, description }`
- **Feature file:** `src/features/bulletin-board/CreatePostPage.tsx`

### 18. Post Detail `/board/[id]`
- **Access:** Logged in
- **Purpose:** View full post, initiate contact
- **Key sections:** Post type pill + timestamp. Route headline in serif type. Specs grid (cu ft, equipment, pickup date). Description block. Contact section — "Contact Poster" button toggles to a "Message thread opened" panel with link to `/messages`. Poster card (`VerificationBadge` + profile link). Report/Flag modal (5 reason options: spam, misleading, contains contact details, inappropriate, other).
- **Primary actions:** Contact Poster, Flag/Report
- **States:** Contact revealed vs hidden (currently client-side state only — disclosure policy TBD)
- **API:** `GET /api/board/posts/:id/`, `POST /api/board/posts/:id/report/`
- **Feature file:** `src/features/bulletin-board/PostDetailPage.tsx`

---

## E. Tier 1 — Community

### 19. Community Chat `/community`
- **Access:** Logged in, any role, any tier (Tier 1 free)
- **Purpose:** Single industry-wide group chat for all roles — the real-time community layer
- **Key sections:** Header bar (channel name, "Tier 1 · Free" badge, "All roles welcome" indicator, role colour legend). Scrollable message thread grouped by day with date separators. Compose bar (pinned bottom).
- **MessageBubble:** Right-aligned orange bubble for self. Left-aligned white bubble for others, with avatar (role-coloured initials), sender name, role pill (Shipper = blue, Broker = purple, Carrier = green). Images render inline (next/image, max 220px). Files render as download links (name + size). `status: 'sending'/'sent'/'error'` indicator.
- **Compose bar:** Paperclip button → file picker (`image/*, .pdf, .doc, .docx, .xls, .xlsx, .csv, .txt`). Staged files shown as chips above bar (image thumbnails or file icons, name, size, × remove). Auto-growing textarea (max 120px). Enter to send, Shift+Enter for new line. Spinner during send.
- **Optimistic send:** Message appears immediately with `status: 'sending'`, resolves to `'sent'` or `'error'`.
- **API (planned):** `POST /api/community/messages/` with FormData `{ body, attachments[] }`
- **Feature file:** `src/features/messaging/GroupConversationPage.tsx`

---

## F. Messaging

### 20. Messaging Inbox `/messages`
- **Access:** Logged in, any role
- **Purpose:** Central hub for all message types
- **Key sections:** Two tabs (URL-synced via `?tab=community`):
  - **Community Channels** (first tab) — card linking to `/community` with "Tier 1 · Free" badge and "Open Community Chat →" button
  - **Direct Messages** (second tab) — search bar (by job ID or company), conversation list
- **Conversation list (Direct tab):** Each card → `/messages/:id`. Shows: avatar (initials, dark bg), unread count badge (orange), company name (bold if unread) + role label, job ID (monospace) + job status pill, last message preview (bold if unread), relative timestamp. Border orange if unread.
- **Primary actions:** Open conversation, switch tabs
- **States:** `useSearchParams` for tab — wrapped in `<Suspense>` at route level.
- **API:** `GET /api/messages/` (inbox)
- **Feature file:** `src/features/messaging/MessagingInboxPage.tsx`

### 21. Conversation Thread `/messages/[id]`
- **Access:** Logged in, participant only
- **Purpose:** Job-specific 1:1 messaging — core anti-disintermediation feature
- **Key sections:** Back link to `/messages`. Job summary card pinned top (counterparty avatar, name/role, job ID, route, status pill, "View job →" link). Scrollable thread (day separators, own messages right/orange, others left/white). Compose bar (same as community chat: file attach, staged chips, auto-grow textarea, Enter to send).
- **Message:** Body + attachments (files as download links with paperclip icon). Timestamp + `'sending'/'error'` status for own messages.
- **Footer note:** "Messages stay on-platform and are tied to job {jobId}."
- **Primary actions:** Send message, attach file
- **States:** Loading, empty (new conversation), sending indicator
- **API (planned):** `POST /api/messages/` with FormData
- **Feature file:** `src/features/messaging/ConversationPage.tsx`

---

## G. Marketplace — Shipper / Broker

### 22. Post a Load `/marketplace/post-load`
- **Access:** Logged in, Advanced verification, Shipper or Broker
- **Purpose:** Create a structured biddable load listing
- **Key sections:** Four `SectionCard` components:
  1. Route — origin city/state, destination (hint: "full addresses shared after booking")
  2. Schedule — pickup date, delivery date (delivery must be after pickup)
  3. Load specs — cubic feet (required), weight lbs (optional), equipment type, special requirements (optional)
  4. Pricing mode — three exclusive options: Open Bidding (carriers compete openly), Best Offer (blind bids), Fixed Price (reveals price input). Visibility: Public / Private.
- **Primary actions:** Publish Load (validates all), Save Draft (skips validation), Cancel
- **Submit modes:** `'publishing' | 'drafting'`. Draft → `/marketplace/my-loads`. Published → `/marketplace/loads/:id`.
- **API:** `POST /api/marketplace/loads/` payload: `{ status, origin, destination, pickup_date, delivery_date, cubic_feet, weight?, equipment_type, pricing_mode, fixed_price?, special_requirements?, visibility }`
- **Feature file:** `src/features/marketplace/shipper/PostLoadPage.tsx`

### 23. My Posted Loads `/marketplace/my-loads`
- **Access:** Logged in, Shipper or Broker
- **Purpose:** List and manage all loads posted by this account
- **Key sections:** Quick stats bar (Total loads, Active bids, Booked, Completed). Search (job ID, origin, destination). Status tabs (All / Open / Bidding / Booked / Completed / Expired) with counts. 1/2/3-column responsive card grid. Skeleton loader. Empty state.
- **LoadCard:** Job ID (mono), route, status pill, specs (cu ft, equipment, pickup, pricing mode, fixed price if set), bids count chip (orange), "View & Manage" → `/marketplace/loads/:id`, "Edit" (only when `status === 'open' || 'draft'` AND `bids.length === 0`)
- **Primary actions:** View, Edit, Post a Load CTA
- **Feature file:** `src/features/marketplace/shipper/MyPostedLoadsPage.tsx`

### 24. Load Detail — Bid Management `/marketplace/loads/[id]`
- **Access:** Logged in, load owner (Shipper/Broker)
- **Purpose:** Central transaction screen — manage all incoming bids
- **Key sections (2-column lg:grid-cols-[1fr_340px]):**
  - **Left:** Load info card (job ID, route headline in serif, status pill, 6-cell specs grid: pickup, delivery, cu ft, equipment, pricing mode, visibility, special requirements). Bids section (count, list of `BidRow` or empty state, "View booking →" if booked).
  - **Right:** Activity log (chronological `auditLog` timeline with actor + action + timestamp, orange dot markers)
- **BidRow:** Carrier avatar + company name (linked to profile) + `VerificationBadge` + star rating + bid note (italic) + timestamp. Amount + counter amount (if countered) + status pill. Actions (hidden when locked or load is booked): **Accept** (green → sets bid `accepted`, all others `rejected`, load → `booked`), **Counter** (inline input → "Send" → bid → `countered` with `counterAmount`), **Reject**, **Message** → `/messages?job=:loadId&carrier=:carrierId`
- **Primary actions:** Accept, Counter, Reject, Message Carrier
- **States:** No bids, bidding open, booked (all actions locked, "View booking →" shown)
- **API:** `GET /api/marketplace/loads/:id/`, planned PATCH for bid actions
- **Feature file:** `src/features/marketplace/shipper/LoadDetailPage.tsx`

### 25. Broker Dashboard `/marketplace/broker-dashboard`
- **Access:** Logged in, Broker role
- **Purpose:** Kanban pipeline across all jobs
- **Key sections:** Header + "New Job" CTA → `/marketplace/post-load`. Global search (across all columns). 4-column kanban: Needs Carrier (📋) | Bidding (⚡) | Booked (✅) | Completed (🏁). Each column has a count badge.
- **KanbanCard:** Job ID + status pill + route + cu ft + pickup date + bids count chip. Entire card is a `<Link>` to `/marketplace/loads/:id`. Empty column shows dashed placeholder.
- **Primary actions:** Click job → `/marketplace/loads/:id`, New Job → `/marketplace/post-load`
- **Feature file:** `src/features/marketplace/shipper/BrokerDashboardPage.tsx`

### 26. Booking Confirmation `/marketplace/booking/[id]`
- **Access:** Logged in, both parties after Accept
- **Purpose:** Read-only final confirmation — locked terms
- **Key sections:** Success banner (green checkmark, "BOOKING CONFIRMED" badge, confirmed-at timestamp). Job ID card (large mono `FTL-2026-NNNN` + booking ref `BK-2026-NNNNN`, orange-bordered). Agreed rate card ($amount, large bold, 🤝). Load details (A→B, dates, cu ft, equipment). Both parties card grid (company name, email, phone — first time contact info is revealed, post-booking only). "What happens next" (4 numbered steps on orange bg). Action buttons: "Message carrier" → `/messages?job=:jobId`, "Print / Download" (`window.print()`), "Back to my loads".
- **Primary actions:** Message counterparty, Print/Download
- **States:** Read-only after confirmation
- **API:** `GET /api/marketplace/bookings/:id/`
- **Feature file:** `src/features/marketplace/shipper/BookingConfirmationPage.tsx`

---

## H. Marketplace — Carrier

### 27. Browse / Search Loads `/marketplace/carrier/loads`
- **Access:** Logged in, Advanced verification, Carrier
- **Purpose:** Find compatible loads to bid on
- **Key sections:** Header with "CARRIER · MARKETPLACE" badge. Sort dropdown (Newest first / Pickup date ↑ / Largest load first). FilterBar (origin, destination, equipment type, pickup from/to, min/max cu ft). Results count. 1/2/3-column responsive grid (page size 6). Skeleton loader. Empty state + "Clear all filters".
- **LoadCard:** Job ID + status pill + "Eligible" green badge (if `status === 'open' || 'bidding'`). Route, cu ft, equipment, pickup, pricing mode, fixed price if set. Poster + `VerificationBadge` + bid count. "View & Bid →" (orange, eligible) or "View Details →" (grey, ineligible).
- **Primary actions:** Filter, Sort, View & Bid
- **API:** `GET /api/marketplace/loads/`
- **Feature file:** `src/features/marketplace/carrier/BrowseLoadsPage.tsx`

### 28. Carrier Load Detail — Place Bid `/marketplace/carrier/loads/[id]`
- **Access:** Logged in, Carrier
- **Purpose:** Carrier's view of a load — submit or manage a bid
- **Key sections (2-column lg:grid-cols-[1fr_320px]):**
  - **Left:** Load info (privacy-limited — no full addresses; note: "shared with winning carrier after booking"). Specs grid. Special requirements (orange alert box). Poster card (company, `VerificationBadge`, star rating, profile link).
  - **Right — Bid panel (5 states):**
    1. `none` — amount input (required) + note textarea + "Submit Bid"
    2. `pending` — amber box, amount, "Waiting for response", Withdraw + Message links
    3. `countered` — orange box, counter amount + original, "Accept Counter" (green) + "Decline & Withdraw" (red)
    4. `accepted` — green box + "View Booking Confirmation →"
    5. `rejected` / `withdrawn` — neutral message, optional "Place a new bid" link
- **Primary actions:** Submit Bid, Accept Counter, Withdraw Bid
- **API:** `POST /api/marketplace/loads/:id/bids/`, `POST .../bids/mine/withdraw/`, `POST .../bids/mine/accept-counter/`
- **Feature file:** `src/features/marketplace/carrier/CarrierLoadDetailPage.tsx`

### 29. My Bids `/marketplace/carrier/my-bids`
- **Access:** Logged in, Carrier
- **Purpose:** Track all bidding activity
- **Key sections:** Header with "CARRIER · MARKETPLACE" badge. Four tabs with counts: Active (pending + countered) | Won (accepted) | Lost (rejected) | Withdrawn. Each `BidRow`: load route + specs + dates, bid status pill, load status pill, amount box, counter box (orange if countered). Actions: View load, Withdraw (pending/countered), "Review counter →" (green, countered), "View booking →" (accepted).
- **Primary actions:** View load, Withdraw bid, Review counter, View booking
- **States:** Empty per tab
- **Feature file:** `src/features/marketplace/carrier/MyBidsPage.tsx`

### 30. Post Available Capacity `/marketplace/carrier/post-capacity`
- **Access:** Logged in, Carrier
- **Purpose:** Advertise empty trailer space (reverse listing)
- **Key sections:** Origin (required), destination (required), available from date (required), available to date (required, must be after from), cubic feet (required), equipment type dropdown, notes (optional).
- **Primary actions:** Publish → inline success screen with "View my postings" link
- **States:** Field validation, `idle | submitting | success | error`
- **API:** `POST /api/marketplace/capacity/` payload: `{ origin, destination, available_from, available_to, cubic_feet, equipment_type, notes? }`
- **Feature file:** `src/features/marketplace/carrier/PostCapacityPage.tsx`

### 31. My Capacity Postings `/marketplace/carrier/my-capacity`
- **Access:** Logged in, Carrier
- **Purpose:** Manage active and past capacity listings
- **Key sections:** Header + "Post Capacity" CTA. Grouped sections: Active (N) / Past. Each `PostingCard`: route, posted date, status pill (active/expired/deactivated), cu ft, equipment, date range, notes (italic). "N offers received" chip. Edit + Deactivate (active only). "View N offers →" if offers > 0.
- **Primary actions:** Edit, Deactivate, View offers
- **States:** Empty state
- **Feature file:** `src/features/marketplace/carrier/MyCapacityPostingsPage.tsx`

---

## I. Reviews

### 32. Leave a Review `/jobs/[jobId]/review`
- **Access:** Logged in, participant of a completed job only
- **Purpose:** Post-job two-way rating tied to a real transaction
- **Key sections:** Overall star rating (1–5, required). Role-specific sub-ratings — Carrier being reviewed: Communication, Reliability, On-time delivery, Load care. Shipper being reviewed: Communication, Payment speed, Load accuracy, Professionalism. Written review text (optional).
- **Primary actions:** Submit review
- **States:** `!eligible` → lock screen ("only after both parties confirm completion"). `alreadyReviewed` → read-only confirmation. `submitted` → success screen.
- **Notes:** `eligible` and `alreadyReviewed` flags must be validated server-side — no arbitrary reviews.
- **API:** `POST /api/marketplace/jobs/:jobId/review/` payload: `{ overall_rating, sub_ratings: { [key]: number }, review_text? }`
- **Feature file:** `src/features/messaging/LeaveReviewPage.tsx`

### 33. Reviews View `/profiles/[id]/reviews`
- **Access:** Logged in (linked from public profile)
- **Purpose:** Full paginated, filterable review list for a company
- **Key sections:** Summary card (avg rating, star display, bar chart per star level — each bar clickable as filter). Sort dropdown (Newest / Highest rated / Lowest rated). Filtered count. Review cards (reviewer name + role badge + overall stars + job ID + date + written review + sub-ratings grid 2×4).
- **Primary actions:** Sort, filter by star rating
- **States:** Empty
- **Feature file:** `src/features/messaging/ReviewsViewPage.tsx`

---

## J. Legal / Utility

### 34. Terms of Service `/terms`
- **Access:** Public
- **Key sections:** Static legal text
- **Notes:** Content pending legal review. Build as simple static page or CMS-editable.
- **Feature file:** `src/features/public/legal/`

### 35. Privacy Policy `/privacy`
- **Access:** Public
- **Key sections:** Static legal text
- **Notes:** Same as above.
- **Feature file:** `src/features/public/legal/`

### 36. 404 / Error Page
- **Access:** Public
- **Key sections:** Friendly message, link back to homepage/dashboard
- **File:** `src/app/not-found.tsx`

---

## Cross-Cutting Notes

### Auth
JWT-based. Login → `POST /api/accounts/login/` (store tokens in cookie/context — TODO: not yet wired). Token refresh pattern matches MovingWyze. `Navbar.tsx` is a Server Component that resolves session via `getSessionUser()` (currently a TODO stub returning `null`) and passes `AuthUser | null` to `NavbarClient`.

### Role-Based Rendering
Single nav for all roles. Role differences live inside pages as conditional tabs and sections — not separate nav structures.

```typescript
interface AuthUser {
  id: string
  email: string
  role: 'shipper' | 'broker' | 'carrier'
  verificationStatus: 'verified' | 'pending' | 'basic' | 'rejected' | 'needs_info' | 'unverified'
  tier: 'bulletin' | 'marketplace'
  companyName: string
  hasSeenOnboarding: boolean
}
```

### Verification Tiers vs Status
- `tier: 'bulletin'` → Tier 1 access only (community, board)
- `tier: 'marketplace'` → Full Tier 2 access
- `verificationStatus: 'basic'` → Tier 1 approved
- `verificationStatus: 'verified'` → Full marketplace approved
These are distinct concepts — tier controls features, verificationStatus controls access level.

### Reusable Components (already built)
- `VerificationBadge` — 6 states (verified/pending/basic/rejected/needs_info/unverified), coloured dot + pill label
- `StarRating` — 1–5 display with brand orange filled stars
- `BidRow` — shipper and carrier variants
- `PostCard` (board feed)
- `LoadCard` (marketplace)
- `FilterBar` — board and marketplace variants
- Status pills: `LOAD_STATUS_COLORS`, `BID_STATUS_COLORS` from `src/features/marketplace/types.ts`
- `MessageBubble` — shared pattern across direct + group chat

### Django Admin Covers (no custom frontend needed)
Verification approval queue, user/company management, moderation, disputes, platform analytics/reports.

### MovingWyze Compatibility
Keep `Load`/`Booking` field naming compatible with MovingWyze `LoadSheetHeader`/`LoadSheetTask` (job ID format `FTL-YYYY-NNNN`, company/warehouse FK pattern). No GPS/live-tracking UI in current scope. Tracking page uses MovingWyze-compatible field naming intentionally.

### Open Items (Pending Client Confirmation)
- Contact-info disclosure timing on board posts (post detail #18 — currently client-side state only)
- Payments/escrow flow (subscription page #13, booking confirmation #26)
- Final verification provider for DOT/MC checks (#9, #10)
- Exact pricing amounts for Tier 1 and Tier 2 (#3)
- Whether Admin users get any Next.js nav presence or use Django Admin exclusively
- JWT token storage mechanism (cookie vs context — TODO in `LoginPage.tsx`)
- Bid accept/reject/counter API calls (`LoadDetailPage.tsx` — currently pure client state)

---

## Navigation Design

### Logged Out
```
[Logo]  How It Works | Pricing        [Login] [Sign Up →]
```

### Logged In (all roles)
```
[Logo]  Board | Community | Marketplace | Messages        [🔔] [Avatar ▾]
```

- **Board** → `/board`
- **Community** → `/community` (Tier 1 group chat, free)
- **Marketplace** → role-resolved by `getMarketplaceHref(role)` in `navConfig.ts`:
  - Carrier → `/marketplace/carrier/loads`
  - Shipper / Broker → `/marketplace/my-loads`
- **Messages** → `/messages` (inbox with Community Channels tab first, Direct Messages second)
- **🔔** → notification bell with unread count badge (icon only, no dedicated nav page)
- **Profile ▾** dropdown → My Profile/Settings (`/profile`), Subscription & Upgrade (`/subscription`), `VerificationBadge` status at top, Logout

### Footer
```
[Logo + Tagline]     Track Shipment | About | Contact | Terms of Service | Privacy Policy
```
Dark background `#1B211A`. Logo icon + "FullTrailerLoad.com" (FullTrailerLoad in white, .com in brand orange). Tagline: "LOADS • BIDS • MOVING • TRANSPORTATION". Copyright line.

### Implementation Notes
- `navConfig.ts` is the single source of truth for all nav items. Four arrays: `publicNavItems`, `authedNavItems`, `profileDropdownItems`, `footerLinks`.
- `NavLink` strips query params from href before pathname comparison (so `/messages?tab=community` doesn't break active-link detection).
- `NavbarClient.tsx` is `'use client'` and handles all interactivity (dropdown, mobile menu, active links). `Navbar.tsx` is the Server Component auth shell.
- Active link: underline animation via Tailwind `after:` pseudo-element on the active route.
- Mobile: hamburger collapses all items into a slide-down panel with same role-aware logic.
