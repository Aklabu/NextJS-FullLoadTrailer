# FullTrailerLoad

> **Live at [fulltrailerload.com](https://fulltrailerload.com)**

FullTrailerLoad is a two-sided freight marketplace built for the household goods (HHG) moving industry. It connects moving companies, freight brokers, and HHG carriers through a structured load board with bidding, carrier matching, shipment tracking, and in-platform messaging — all backed by DOT/MC verification.

The platform operates in two tiers:

- **Tier 1 — Bulletin Board** (free, basic verification): community chat, informal load and capacity posts, private messaging.
- **Tier 2 — Marketplace** (advanced verification): structured load listings, competitive bidding, booking, document management, and shipment tracking.

---

## Features

- **Role-based access** — Shippers, Freight Brokers, and Carriers each get a tailored experience within a single unified UI.
- **Bulletin Board** — Post loads and available capacity informally; browse and filter community posts.
- **Marketplace** — Publish structured biddable loads, manage incoming bids (accept / counter / reject), and generate booking confirmations.
- **Bidding engine** — Open bidding, best-offer (blind), and fixed-price modes. Carriers track all bids across Active / Won / Lost / Withdrawn tabs.
- **Community chat** — Real-time industry-wide group chat (Tier 1, free for all roles).
- **Direct messaging** — Job-scoped 1:1 threads with file attachments, keeping communication on-platform.
- **Shipment tracking** — Public job-ID search (`FTL-YYYY-NNNN` format) with status milestones and progress display.
- **Verification flow** — Multi-step registration with document upload; admin approval queue via Django Admin.
- **Reviews** — Post-job two-way ratings tied to real transactions, with per-role sub-rating categories.
- **Onboarding modal** — First-login walkthrough explaining tier structure and guiding the first action.
- **JWT authentication** — 2-step login (credentials → email OTP) with token refresh.

---

## Tech Stack

- **Framework** — [Next.js 16.3.5](https://nextjs.org/) with App Router, Server Components by default
- **UI library** — [React 19](https://react.dev/)
- **Language** — [TypeScript 5](https://www.typescriptlang.org/)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com/) configured via `@theme inline` in `globals.css` (no `tailwind.config.js`)
- **Backend API** — [Django REST Framework](https://www.django-rest-framework.org/)
- **Auth** — JWT (access + refresh tokens) with email OTP as second factor
- **Linting** — ESLint 9 with `eslint-config-next`

---

## Project Structure

```
src/
├── app/                        # Next.js App Router — routes and layouts only
│   ├── (marketing)/            # Public marketing pages (homepage, how-it-works, pricing)
│   ├── (public)/               # Public utility pages (tracking, contact)
│   ├── (authenticated)/        # Protected app pages — requires login
│   │   ├── board/              # Tier 1 bulletin board
│   │   ├── community/          # Tier 1 group chat
│   │   ├── marketplace/        # Tier 2 load board, bidding, booking
│   │   ├── messages/           # Inbox + conversation threads
│   │   ├── jobs/               # Job-specific pages (reviews)
│   │   ├── profile/            # Company settings
│   │   ├── profiles/           # Public-facing company profiles
│   │   ├── subscription/       # Tier management
│   │   └── notifications/      # Notification preferences
│   └── auth/                   # Auth pages (login, register, signup, forgot-password)
│
├── features/                   # Business logic scoped to each feature
│   ├── account/                # Profile, subscription, public profiles, notifications
│   ├── auth/                   # Login, register, role selection, onboarding modal
│   ├── bulletin-board/         # Board feed, post detail, create post
│   ├── dashboard/              # Post-login dashboard
│   ├── marketplace/
│   │   ├── carrier/            # Browse loads, place bids, capacity postings
│   │   └── shipper/            # Post loads, bid management, broker kanban, booking
│   ├── messaging/              # Inbox, conversation threads, group chat, reviews
│   ├── notifications/          # Notification settings
│   └── public/                 # Homepage, how-it-works, pricing, contact, tracking
│
├── components/                 # Shared UI used across multiple features
│   ├── Navbar.tsx              # Server Component auth shell
│   ├── NavbarClient.tsx        # Client Component — interactivity, mobile menu, dropdowns
│   ├── Footer.tsx
│   ├── VerificationBadge.tsx   # 6-state verification status pill
│   ├── StarRating.tsx
│   ├── BidRow.tsx
│   ├── PostCard.tsx
│   ├── LoadCard.tsx
│   └── ...
│
└── lib/                        # Shared utilities, API client, constants, types
    ├── apiClient.ts            # Base fetch wrapper with token refresh
    ├── auth.ts                 # Session helpers
    ├── navConfig.ts            # Single source of truth for all nav items
    └── ...
```

---

## Installation & Setup

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Clone the repository
git clone https://github.com/your-org/fulltrailerload-nextjs.git
cd fulltrailerload-nextjs

# 2. Install dependencies
npm install

# 3. Configure environment variables (see section below)
cp .env.example .env.local
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

**`NEXT_PUBLIC_API_BASE_URL`** — Django REST Framework base URL, no trailing slash.

```bash
# Local development
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.fulltrailerload.com
```

---

## Run Locally

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

This requires the Django backend to be running and reachable at the URL configured in `NEXT_PUBLIC_API_BASE_URL`.

---

## Build & Production

```bash
# Create an optimised production build
npm run build

# Start the production server
npm run start
```

Lint the codebase:

```bash
npm run lint
```

---

## API Integration

The frontend communicates exclusively with a **Django REST Framework** backend at the URL set in `NEXT_PUBLIC_API_BASE_URL`.

### Authentication flow

1. `POST /api/accounts/login/` — verifies credentials and sends an email OTP.
2. `POST /api/accounts/otp/verify/` with `purpose: login2fa` — returns `access` and `refresh` JWT tokens.
3. `POST /api/accounts/token/refresh/` — called automatically when the access token expires (401 response).

### Endpoint groups

- `/api/accounts/` — registration, login, OTP, profile, documents, password
- `/api/board/` — bulletin board posts
- `/api/marketplace/` — loads, bids, bookings, capacity, reviews
- `/api/messages/` — direct message threads
- `/api/community/` — group chat messages
- `/api/tracking/` — public shipment status lookup
- `/api/support/` — contact form submissions

Full field contracts are documented in the project's internal API spec.

---

## Deployment

The app is live at **[fulltrailerload.com](https://fulltrailerload.com)**.

### Vercel

```bash
# Install the Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Set `NEXT_PUBLIC_API_BASE_URL` to your production API URL in the Vercel dashboard under **Project → Settings → Environment Variables**.

### Self-hosted

```bash
npm run build
npm run start
```

Run behind a reverse proxy (nginx or Caddy) with HTTPS. Ensure the Django API has CORS configured to allow requests from your frontend domain.

---

## License & Author

**Private / Proprietary** — All rights reserved.

Built and maintained by the FullTrailerLoad development team.

> [fulltrailerload.com](https://fulltrailerload.com)
