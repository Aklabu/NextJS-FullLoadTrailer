---
inclusion: always
---

# FullLoadTrailer — Frontend Page Specifications

**35 custom pages** | Backend: Django REST Framework + Django Admin | Scope: Tier 1 (Bulletin Board) + Tier 2 (Marketplace) only — Tier 3 (Operations/Driver) deferred.

---

## A. Public / Marketing

### 1. Homepage
- **Access:** Public
- **Purpose:** Explain the platform, drive sign-ups, differentiate from a plain load board
- **Key sections:** Hero (value prop + CTA), "How it works" 3-step summary, Tier comparison teaser, testimonials/stats, CTA banner, footer
- **Primary actions:** Sign Up, Login, "Track a Shipment" quick link
- **Notes:** Route CTA based on role selector or defer role choice to Sign Up page

### 2. How It Works
- **Access:** Public
- **Purpose:** Explain flow for each role (Shipper/Broker vs Carrier) and tier structure
- **Key sections:** Tabbed or side-by-side explainer per role, visual flow diagram (post → bid → book), FAQ accordion
- **Primary actions:** Sign Up CTA at bottom

### 3. Pricing / Tiers Comparison
- **Access:** Public
- **Purpose:** Show Tier 1 (Bulletin) vs Tier 2 (Marketplace) features and cost side by side
- **Key sections:** Comparison table (features x tiers), FAQ on billing, upgrade note
- **Primary actions:** Choose Plan → routes to Sign Up with tier pre-selected
- **Notes:** Pricing values TBD — build as data-driven/configurable, not hardcoded

### 4. Contact / Support
- **Access:** Public
- **Key sections:** Contact form (name, email, subject, message, optional company), support email/phone, FAQ link
- **Primary actions:** Submit form
- **States:** Success confirmation, validation errors
- **API:** POST `/support/contact/`

### 5. Public Tracking / Status Lookup
- **Access:** Public, no login required
- **Purpose:** Check shipment status by Job ID
- **Key sections:** Search input (Job ID), result card (Not Picked / In Transit / Complete), general route info (no PII)
- **States:** Empty, Not found, Result found
- **API:** GET `/api/tracking/search/?job_id=...`

---

## B. Auth & Onboarding

### 6. Sign Up — Role Selection
- **Access:** Public
- **Key sections:** Three role cards (Shipper/Moving Company, Broker, Carrier) with one-line descriptions
- **Primary actions:** Select role → routes to Registration Form (#9) with role pre-filled

### 7. Login
- **Access:** Public
- **Key sections:** Email + password, "Forgot password" link
- **States:** Loading, invalid credentials, account-not-verified (redirect to #10)
- **API:** POST `/api/accounts/login/` (JWT)

### 8. Forgot Password / OTP Reset
- **Access:** Public
- **Key sections:** Step 1 — enter email; Step 2 — enter OTP; Step 3 — set new password
- **States:** Loading, OTP sent, invalid/expired OTP, success
- **API:** POST `/api/accounts/password/forgot/`, `/api/accounts/password/reset/`

### 9. Registration Form — Company + Verification Docs
- **Access:** Public (post role-selection)
- **Key sections:** Company info, role-specific fields (DOT/MC for Carrier, business license for Broker/Shipper), document upload, password creation
- **States:** Field-level validation, upload progress, submit success → routes to #10
- **Notes:** "Basic" (bulletin-only) vs "Advanced" (marketplace) verification levels — advanced adds DOT/MC/insurance fields

### 10. Verification Pending / Status Page
- **Access:** Logged in, unverified/pending user
- **Key sections:** Status banner (Pending / Approved / Rejected / Needs More Info), what happens next, contact support
- **States:** Pending, Approved (redirect to dashboard), Rejected (show reason), Needs More Info
- **API:** GET current user verification status

### 11. Onboarding Walkthrough
- **Access:** Logged in, freshly verified user (first login only)
- **Key sections:** 3–4 step modal or carousel: bulletin board explainer, marketplace explainer, how bidding works, first CTA
- **Primary actions:** Skip, Next, Finish → routes to dashboard
- **Notes:** One-time, dismissible — store `has_seen_onboarding` flag

---

## C. Account & Profile

### 12. My Profile / Company Settings
- **Access:** Logged in, own account
- **Key sections:** Editable company info form, password change link, verification status, logout
- **States:** Loading, save success, validation errors

### 13. Subscription & Tier Upgrade
- **Access:** Logged in
- **Key sections:** Current plan card, comparison table (reuse from #3), upgrade button, billing history
- **States:** Current tier highlighted, upgrade confirmation modal, payment flow (payments model TBD with client)

### 14. Public-Facing Profile Page
- **Access:** Public / logged-in users (info depth depends on viewer's verification level)
- **Key sections:** Company name/logo, verification badge, rating summary (avg stars), written reviews, job history count, "Message" or "View active loads" button
- **States:** No reviews yet, profile not verified

### 15. Notification Preferences
- **Access:** Logged in
- **Key sections:** Toggle list — new bid, counteroffer, message, booking confirmed, verification update, etc.
- **States:** Save confirmation

---

## D. Tier 1 — Bulletin Board

### 16. Board Feed
- **Access:** Logged in, at least Basic verification
- **Key sections:** Filter bar (origin, destination, date range, equipment type), post cards (route, cu ft, date, verified badge, "Contact Poster"), Create Post CTA
- **States:** Loading, empty (no posts match filters), infinite scroll or pagination

### 17. Create Post
- **Access:** Logged in, Basic verification
- **Key sections:** Origin, destination, approx cu ft, equipment type, pickup date, description, post type (load available / capacity available)
- **States:** Validation, publish success → feed or detail
- **Notes:** No pricing/bidding fields — intentionally minimal; do not expose full addresses/inventory details

### 18. Post Detail
- **Access:** Logged in
- **Key sections:** Full post info, poster's verification badge + profile link (#14), Contact/Reply button, report/flag option
- **Primary actions:** Contact Poster, Flag/Report
- **Notes:** Contact-info disclosure timing TBD (open item)

---

## E. Marketplace — Shipper/Broker Side

### 19. Post a Load
- **Access:** Logged in, Advanced verification (Shipper or Broker)
- **Key sections:** Origin/destination, pickup & delivery dates, cubic feet, equipment requirements, pricing mode (Fixed / Best Offer / Open Bidding), special requirements, visibility setting
- **Primary actions:** Publish Load, Save Draft

### 20. My Posted Loads
- **Access:** Logged in, Shipper/Broker
- **Key sections:** Table/card list with status filter (Open / Bidding / Booked / Completed / Expired), quick stats (# bids received), search
- **States:** Empty state ("Post your first load"), loading

### 21. Load Detail — Bids, Counter/Accept/Reject
- **Access:** Logged in (owner sees full bid management; carriers see bid box)
- **Purpose:** Core transaction screen
- **Key sections:** Full load info, bid list (carrier name, amount, timestamp, rating/badge), counteroffer input per bid, Accept/Reject buttons, bid history/audit log, messaging link per bidder
- **States:** No bids yet, bidding open, bid accepted (locks other bids → "Booked"), expired

### 22. Broker Dashboard
- **Access:** Logged in, Broker role
- **Key sections:** Kanban or tabbed view — "Needs Carrier / Bidding / Booked / Completed" columns with counts, quick filters, search by job number
- **Primary actions:** Click job → #21, Create new job → #19

### 23. Booking Confirmation Page
- **Access:** Logged in, both parties after Accept
- **Key sections:** Final agreed price, both party details, job/master ID generated, next steps message, download/print confirmation
- **States:** Confirmed (read-only after this point)

---

## F. Marketplace — Carrier Side

### 24. Browse / Search Loads
- **Access:** Logged in, Advanced verification, Carrier role
- **Key sections:** Filter bar (origin, destination, pickup date range, cu ft, equipment), sortable list/map toggle (optional), load cards + "eligible" badge
- **States:** Empty (no matches), loading, pagination

### 25. Load Detail — Place Bid/Counter
- **Access:** Logged in, Carrier
- **Key sections:** Load info (limited pre-award), bid input form, current bid status, counteroffer display, Accept/Withdraw buttons
- **States:** Not yet bid, bid pending, countered, accepted/booked, rejected/expired

### 26. My Bids
- **Access:** Logged in, Carrier
- **Key sections:** Tabs — Active / Won / Lost / Withdrawn, list with load summary + bid amount + status
- **States:** Empty per tab

### 27. Post Available Capacity (Reverse Listing)
- **Access:** Logged in, Carrier
- **Key sections:** Route (origin → destination), available cu ft, date window, equipment type, notes
- **States:** Validation, success

### 28. My Capacity Postings
- **Access:** Logged in, Carrier
- **Key sections:** List of postings with status, offers received count
- **Primary actions:** Edit, Deactivate, View offers received

---

## G. Shared Marketplace Features

### 29. Messaging Inbox
- **Access:** Logged in, any role
- **Key sections:** Conversation list (counterparty name, last message preview, unread indicator, linked job ID), search/filter
- **States:** Empty, unread badge count

### 30. Conversation Thread (Job-Linked)
- **Access:** Logged in, participant only
- **Purpose:** Job-specific messaging — core anti-disintermediation feature
- **Key sections:** Message thread, linked job/load summary card at top, attachment upload, timestamps
- **States:** Loading history, empty (new conversation), sending indicator

### 31. Leave a Review (Post-Job)
- **Access:** Logged in, participant of a completed job only
- **Key sections:** Star rating, sub-ratings (communication, reliability, on-time — per role), written review text
- **States:** Already reviewed (read-only), not yet eligible (job not complete)
- **Notes:** Server-side validate review is tied to a real completed job — no arbitrary reviews

### 32. Reviews View (On Profile)
- **Access:** Public (embedded in #14, but may need own paginated view)
- **Key sections:** Sortable/filterable review list, rating breakdown chart
- **States:** Empty

---

## H. Legal / Utility

### 33. Terms of Service
- **Access:** Public
- **Notes:** Build as CMS-editable or simple static page — content pending legal review

### 34. Privacy Policy
- **Access:** Public
- **Notes:** Same as above — pending legal review

### 35. 404 / Error Page
- **Access:** Public
- **Key sections:** Friendly message, link back to homepage/dashboard

---

## Cross-Cutting Notes

- **Auth:** JWT-based, matching MovingWyze pattern (`/api/accounts/login/`, token refresh)
- **Role-based rendering:** Single layout shell (nav + sidebar) conditionally renders based on role (Shipper/Broker/Carrier/Admin) and verification tier — no separate codebases per role
- **Reusable components to build once:** Load Card, Bid Row, Verification Badge, Star Rating, Filter Bar, Status Pill (Open/Bidding/Booked/Completed), Message Thread
- **Django Admin covers (no custom frontend needed):** verification approval queue, user/company management, moderation, disputes, platform analytics
- **Future-proofing for MovingWyze integration:** Keep `Load`/`Booking` model field naming loosely compatible with MovingWyze's `LoadSheetHeader`/`LoadSheetTask` — no GPS/live-tracking UI needed now
- **Open items pending client confirmation:** contact-info disclosure timing (#18, #21, #25), payments/escrow flow (#13, #23), final verification provider (#9, #10), monetization model (#13)

---

## Navigation Design

Nav is role-aware (Shipper / Broker / Carrier), not a single static menu.

### Logged Out
```
Logo | How It Works | Pricing        [Login] [Sign Up]
```

### Logged In (all roles)
```
Logo | Board | Marketplace | Messages        [🔔] [Profile ▾]
```
- **Board** → Bulletin Board Feed (#16); Create Post is an in-page action
- **Marketplace** → role-aware landing:
  - Shipper/Broker → My Posted Loads (#20), with in-page tabs for Post a Load (#19) / Broker Dashboard (#22, Broker only)
  - Carrier → Browse Loads (#24), with in-page tabs for My Bids (#26) / Post Capacity (#27) / My Capacity Postings (#28)
- **Messages** → Messaging Inbox (#29)
- **🔔** → notification icon/badge only, no dedicated nav page
- **Profile ▾** dropdown → My Profile/Settings (#12), Subscription & Upgrade (#13), Logout
- **Verification badge/pill** — persistent near Profile: Verified ✓ / Pending Review / Basic Tier

### Footer
```
Track Shipment | About | Contact | Terms of Service | Privacy Policy
```

### Implementation Notes
- Keep nav items in a single config array (`navConfig.ts`) filtered by `user.role` and `user.tier`
- Role/tier differences live inside pages (tabs, conditional sections), not in the nav structure itself
- **Open question:** does Admin get any Next.js nav presence, or does Admin only use Django Admin? Decides whether a 4th role branch is needed in `navConfig.ts`
