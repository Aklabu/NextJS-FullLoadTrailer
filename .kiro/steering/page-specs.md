---
inclusion: always
---

# FullTrailerLoad — Frontend Page Specifications
**35 custom pages** | Backend: Django REST Framework + Django Admin | Scope: Tier 1 (Bulletin Board) + Tier 2 (Marketplace) only — Tier 3 (Operations/Driver) deferred, not integrated yet.

---

## A. Public / Marketing

### 1. Homepage
- **Access:** Public
- **Purpose:** Explain the platform, drive sign-ups, differentiate from a plain load board
- **Key sections:** Hero (value prop + CTA), "How it works" 3-step summary, Tier comparison teaser, testimonials/stats (loads posted, carriers verified), CTA banner, footer with links
- **Primary actions:** Sign Up, Login, "Track a Shipment" quick link
- **States:** none (static/marketing)
- **Notes:** Should route CTA based on role selector or defer role choice to Sign Up page

### 2. How It Works
- **Access:** Public
- **Purpose:** Explain the flow for each role (Shipper/Broker vs Carrier) and tier structure
- **Key sections:** Tabbed or side-by-side explainer per role, visual flow diagram (post → bid → book), FAQ accordion
- **Primary actions:** Sign Up CTA at bottom
- **States:** none

### 3. Pricing / Tiers Comparison
- **Access:** Public
- **Purpose:** Show Tier 1 (Bulletin) vs Tier 2 (Marketplace) features and cost side by side
- **Key sections:** Comparison table (features x tiers), FAQ on billing, upgrade note ("start free, upgrade anytime")
- **Primary actions:** Choose Plan → routes to Sign Up with tier pre-selected
- **States:** none
- **Notes:** Pricing values TBD from client — build as data-driven/configurable, not hardcoded

### 4. Contact / Support
- **Access:** Public
- **Purpose:** General inquiries, support requests
- **Key sections:** Contact form (name, email, subject, message, optional company), support email/phone, link to FAQ
- **Primary actions:** Submit form
- **States:** Success confirmation, validation errors
- **API:** POST to a `/support/contact/` endpoint or email service

### 5. Public Tracking / Status Lookup Page
- **Access:** Public, no login required
- **Purpose:** Let a customer check shipment status by Job ID (mirrors MovingWyze's tracking search)
- **Key sections:** Search input (Job ID), result card showing status (Not Picked / In Transit / Complete), general route info (no sensitive customer PII)
- **Primary actions:** Search
- **States:** Empty (no search yet), Not found, Result found
- **API:** GET `/api/tracking/search/?job_id=...` (matches existing MovingWyze pattern — build compatible even without integrating yet)

---

## B. Auth & Onboarding

### 6. Sign Up — Role Selection
- **Access:** Public
- **Purpose:** Entry point to registration, choose account type
- **Key sections:** Three role cards (Shipper/Moving Company, Broker, Carrier) each with a one-line description, "Already have an account? Login" link
- **Primary actions:** Select role → routes to Registration Form (#9) with role pre-filled
- **States:** none

### 7. Login
- **Access:** Public
- **Purpose:** Authenticate existing users
- **Key sections:** Email + password fields, "Forgot password" link, Login button, link to Sign Up
- **Primary actions:** Login
- **States:** Loading, invalid credentials error, account-not-verified message (redirect to #10)
- **API:** POST `/api/accounts/login/` (JWT — matches existing MovingWyze auth pattern)

### 8. Forgot Password / OTP Reset
- **Access:** Public
- **Purpose:** Password recovery via OTP (matches existing MovingWyze OTP model)
- **Key sections:** Step 1 — enter email; Step 2 — enter OTP code; Step 3 — set new password
- **Primary actions:** Send OTP, Verify OTP, Reset Password
- **States:** Loading, OTP sent confirmation, invalid/expired OTP error, success
- **API:** POST `/api/accounts/password/forgot/`, `/api/accounts/password/reset/`

### 9. Registration Form — Company + Verification Docs
- **Access:** Public (post role-selection)
- **Purpose:** Collect company identity and compliance info
- **Key sections:** Company info (name, email, phone, address), role-specific fields (DOT/MC for Carrier, business license for Broker/Shipper), document upload (insurance, authority docs), password creation
- **Primary actions:** Submit for review
- **States:** Field-level validation, upload progress, submit success → routes to #10
- **Notes:** Should support "Basic" (bulletin-only) vs "Advanced" (marketplace) verification levels as different form depths — advanced adds DOT/MC/insurance fields

### 10. Verification Pending / Status Page
- **Access:** Logged in, unverified/pending user
- **Purpose:** Inform user of review status, block marketplace access until approved
- **Key sections:** Status banner (Pending Review / Approved / Rejected / Needs More Info), what happens next, contact support link
- **Primary actions:** Re-upload documents if rejected, contact support
- **States:** Pending, Approved (redirect to dashboard), Rejected (show reason), Needs More Info
- **API:** GET current user verification status

### 11. Onboarding Walkthrough
- **Access:** Logged in, freshly verified user (first login)
- **Purpose:** Explain tier structure and guide first action
- **Key sections:** 3–4 step modal or full-page carousel: what the bulletin board is, what the marketplace is, how bidding works, first CTA ("Post your first load" / "Browse loads")
- **Primary actions:** Skip, Next, Finish → routes to dashboard
- **States:** none (one-time, dismissible, store "has_seen_onboarding" flag)

---

## C. Account & Profile

### 12. My Profile / Company Settings
- **Access:** Logged in, own account
- **Purpose:** Edit company info, contact details, logo
- **Key sections:** Editable form (company info fields from registration), password change link, verification status display, logout
- **Primary actions:** Save changes, Change Password
- **States:** Loading, save success, validation errors

### 13. Subscription & Tier Upgrade Page
- **Access:** Logged in
- **Purpose:** View current tier, upgrade to marketplace/premium
- **Key sections:** Current plan card, comparison table (reuse from #3), upgrade button, billing history (if payments are live)
- **Primary actions:** Upgrade Tier
- **States:** Current tier highlighted, upgrade confirmation modal, payment flow (if applicable — payments model still TBD with client)

### 14. Public-Facing Profile Page
- **Access:** Public (viewable by other logged-in users), viewer sees limited/full info based on their own verification level
- **Purpose:** Build trust — show verification badge and reputation before a bid/deal
- **Key sections:** Company name/logo, verification badge (Approved/Pending), rating summary (avg stars), written reviews list, job history count (not detailed job data), "Message" or "View active loads" button
- **Primary actions:** Message, view loads/capacity (if Carrier)
- **States:** No reviews yet, profile not verified

### 15. Notification Preferences
- **Access:** Logged in
- **Purpose:** Control email/in-app notification settings
- **Key sections:** Toggle list — new bid, counteroffer, message, booking confirmed, verification update, etc.
- **Primary actions:** Save preferences
- **States:** Save confirmation

---

## D. Tier 1 — Bulletin Board

### 16. Board Feed
- **Access:** Logged in, at least Basic verification
- **Purpose:** Browse informal community posts
- **Key sections:** Filter bar (origin, destination, date range, equipment type), post cards (route, cu ft, date, verified badge, "Contact Poster" button), Create Post CTA
- **Primary actions:** Filter, Create Post, Contact Poster
- **States:** Loading, empty (no posts match filters), infinite scroll or pagination

### 17. Create Post
- **Access:** Logged in, Basic verification
- **Purpose:** Publish a bulletin board post
- **Key sections:** Simple form — origin, destination, approx cu ft, equipment type, pickup date, general description, post type (load available / capacity available)
- **Primary actions:** Publish
- **States:** Validation, publish success → routes to feed or detail
- **Notes:** No pricing/bidding fields — intentionally minimal per docs ("do not expose full addresses/inventory details")

### 18. Post Detail
- **Access:** Logged in
- **Purpose:** View full post, initiate contact
- **Key sections:** Full post info, poster's verification badge + link to their profile (#14), Contact/Reply button (opens messaging or reveals contact per business rule), report/flag option
- **Primary actions:** Contact Poster, Flag/Report
- **States:** Contact revealed vs. hidden (depends on final disclosure policy — flag as TBD)

---

## E. Marketplace — Shipper/Broker Side

### 19. Post a Load
- **Access:** Logged in, Advanced verification (Shipper or Broker)
- **Purpose:** Create a structured, biddable load listing
- **Key sections:** Origin/destination, pickup & delivery dates, cubic feet, equipment requirements, pricing mode selector (Fixed Price / Best Offer / Open Bidding), special requirements, visibility setting (public to qualified carriers / private/restricted)
- **Primary actions:** Publish Load, Save Draft
- **States:** Validation, publish success → routes to #20 or #21

### 20. My Posted Loads
- **Access:** Logged in (Shipper/Broker)
- **Purpose:** List/manage all loads posted by this account
- **Key sections:** Table/card list with status filter (Open / Bidding / Booked / Completed / Expired), quick stats (# bids received), search
- **Primary actions:** View load, Edit (if no bids yet), Cancel/Remove listing
- **States:** Empty state ("Post your first load"), loading

### 21. Load Detail (Bids, Counter/Accept/Reject)
- **Access:** Logged in (owner sees full bid management; carriers see bid box)
- **Purpose:** Central transaction screen — the core of the marketplace
- **Key sections:** Full load info, bid list (carrier name, bid amount, timestamp, carrier rating/verification badge), counteroffer input per bid, Accept/Reject buttons, bid history/audit log, messaging link per bidder
- **Primary actions:** Counter, Accept Bid, Reject Bid, Message Carrier
- **States:** No bids yet, bidding open, bid accepted (locks other bids, shows "Booked" state), expired

### 22. Broker Dashboard
- **Access:** Logged in, Broker role
- **Purpose:** Pipeline overview across many booked/unbooked jobs at once
- **Key sections:** Kanban or tabbed view — "Needs Carrier / Bidding / Booked / Completed" columns with counts, quick filters, search by job number
- **Primary actions:** Click job → routes to #21, Create new job → routes to #19
- **States:** Empty per column, loading

### 23. Booking Confirmation Page
- **Access:** Logged in, both parties after Accept action
- **Purpose:** Final confirmation screen locking in agreed terms
- **Key sections:** Final agreed price, both party details (as authorized), job/master ID generated, next steps message, download/print confirmation
- **Primary actions:** Confirm, Message counterparty, (future) proceed to operations
- **States:** Confirmed (read-only after this point)

---

## F. Marketplace — Carrier Side

### 24. Browse / Search Loads
- **Access:** Logged in, Advanced verification, Carrier role
- **Purpose:** Find compatible loads to bid on
- **Key sections:** Filter bar (origin, destination, pickup date range, cu ft, equipment), sortable list/map toggle (optional), load cards showing key info + "eligible" badge
- **Primary actions:** Filter, View Load → routes to #25
- **States:** Empty (no matches), loading, pagination

### 25. Load Detail — Place Bid/Counter
- **Access:** Logged in, Carrier
- **Purpose:** Carrier's view of a specific load — submit or manage a bid
- **Key sections:** Load info (limited pre-award per privacy rules), bid input form, current bid status if already bid, counteroffer display if shipper countered, Accept/Withdraw buttons
- **Primary actions:** Submit Bid, Accept Counter, Withdraw Bid
- **States:** Not yet bid, bid pending, countered, accepted/booked, rejected/expired

### 26. My Bids
- **Access:** Logged in, Carrier
- **Purpose:** Track all bidding activity
- **Key sections:** Tabs — Active / Won / Lost / Withdrawn, list with load summary + bid amount + status
- **Primary actions:** View load, Withdraw active bid
- **States:** Empty per tab

### 27. Post Available Capacity (Reverse Listing)
- **Access:** Logged in, Carrier
- **Purpose:** Advertise empty trailer space so shippers/brokers can reach out
- **Key sections:** Current route (origin → destination), available cu ft, date window, equipment type, notes
- **Primary actions:** Publish
- **States:** Validation, success

### 28. My Capacity Postings
- **Access:** Logged in, Carrier
- **Purpose:** Manage active/expired capacity listings
- **Key sections:** List of postings with status, offers received count (if shippers send direct offers)
- **Primary actions:** Edit, Deactivate, View offers received
- **States:** Empty, loading

---

## G. Shared Marketplace Features

### 29. Messaging Inbox
- **Access:** Logged in, any role
- **Purpose:** List all conversations
- **Key sections:** Conversation list (counterparty name, last message preview, unread indicator, linked job ID), search/filter
- **Primary actions:** Open conversation → routes to #30
- **States:** Empty, unread badge count

### 30. Conversation Thread (Job-Linked)
- **Access:** Logged in, participant only
- **Purpose:** Job-specific messaging, kept in-platform (core anti-disintermediation feature)
- **Key sections:** Message thread, linked job/load summary card at top, attachment upload (documents/photos), timestamp per message
- **Primary actions:** Send message, attach file
- **States:** Loading history, empty (new conversation), sending indicator

### 31. Leave a Review (Post-Job)
- **Access:** Logged in, participant of a completed job only
- **Purpose:** Two-way rating tied to an actual completed transaction
- **Key sections:** Overall star rating, sub-ratings (communication, reliability, on-time, etc. — per role), written review text field
- **Primary actions:** Submit review
- **States:** Already reviewed (read-only), not yet eligible (job not complete)
- **Notes:** Must validate server-side that review is tied to a real completed job — no arbitrary reviews per docs

### 32. Reviews View (On Profile)
- **Access:** Public (embedded within #14, but listed separately as it may need its own full list/pagination view)
- **Purpose:** Full list of reviews for a company, beyond the summary shown on the profile
- **Key sections:** Sortable/filterable review list, rating breakdown chart
- **Primary actions:** Sort, filter by rating
- **States:** Empty

---

## H. Legal / Utility

### 33. Terms of Service
- **Access:** Public
- **Purpose:** Legal terms — content to be finalized with counsel per client docs
- **Key sections:** Static legal text
- **Notes:** Build as CMS-editable or simple static page; content pending legal review

### 34. Privacy Policy
- **Access:** Public
- **Purpose:** Legal privacy terms
- **Key sections:** Static legal text
- **Notes:** Same as above — pending legal review

### 35. 404 / Error Page
- **Access:** Public
- **Purpose:** Handle broken/invalid routes
- **Key sections:** Friendly message, link back to homepage/dashboard
- **States:** n/a

---

## Cross-Cutting Notes for Frontend Dev

- **Auth:** JWT-based, matching the existing MovingWyze pattern (`/api/accounts/login/`, token refresh) — reuse this convention for consistency even though this is a separate Django project for now.
- **Role-based rendering:** A single layout shell (nav + sidebar) should conditionally render nav items and dashboard content based on role (Shipper/Broker/Carrier/Admin) and verification tier — avoid separate codebases per role.
- **Reusable components to build once:** Load Card, Bid Row, Verification Badge, Star Rating, Filter Bar, Status Pill (Open/Bidding/Booked/Completed), Message Thread component.
- **Django Admin covers (no custom frontend needed):** verification approval queue, user/company management, moderation, disputes, platform analytics/reports.
- **Future-proofing for MovingWyze integration:** Keep `Load`/`Booking` model field naming loosely compatible with MovingWyze's `LoadSheetHeader`/`LoadSheetTask` (job ID format, company/warehouse FK pattern) so a future sync is a mapping exercise, not a rebuild. No GPS/live-tracking UI needed now per current scope.
- **Open items still pending client confirmation** that affect several pages above: contact-info disclosure timing (#18, #21, #25), payments/escrow flow (#13, #23), final verification provider (#9, #10), monetization model (#13).

---

## Navigation Design (Next.js Frontend)

Nav is role-aware (Shipper / Broker / Carrier), not a single static menu. Kept minimal — most links live as in-page tabs rather than top-nav items.

### Logged Out
```
Logo | How It Works | Pricing        [Login] [Sign Up]
```

### Logged In (all roles)
```
Logo | Board | Marketplace | Messages        [🔔] [Profile ▾]
```
- **Board** → routes to Bulletin Board Feed (#16); Create Post (#17) is an in-page action, not a separate nav item
- **Marketplace** → routes to a role-aware landing page:
  - Shipper/Broker lands on **My Posted Loads** (#20), with in-page tabs for Post a Load (#19) / Broker Dashboard (#22, Broker only)
  - Carrier lands on **Browse Loads** (#24), with in-page tabs for My Bids (#26) / Post Capacity (#27) / My Capacity Postings (#28)
- **Messages** → routes to Messaging Inbox (#29)
- **🔔** → notification icon/badge only, no dedicated page link in the bar
- **Profile ▾** dropdown → My Profile/Settings (#12), Subscription & Upgrade (#13), Logout
- **Verification badge/pill** — persistent indicator near Profile showing Verified ✓ / Pending Review / Basic Tier (reinforces trust layer on every page)

### Footer (not top nav)
```
Track Shipment | About | Contact | Terms of Service | Privacy Policy
```

### Implementation Notes
- Keep nav items in a single config array (e.g. `navConfig.ts`) filtered by `user.role` and `user.tier`, rendered conditionally by one `Navbar.tsx` component — avoids forking the nav per role.
- Role/tier differences live inside pages (tabs, conditional sections) rather than in the nav structure itself, keeping the bar itself identical across all three roles.
- **Open question for client/team:** does Admin get any Next.js frontend nav presence, or does Admin only ever use Django Admin directly? Decides whether a 4th role branch is needed in `navConfig.ts`.
