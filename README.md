# Customer Outreach Suite

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?logo=postgresql&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-wa.me-25D366?logo=whatsapp&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspaces-F69220)
![Automation](https://img.shields.io/badge/Automation-Custom-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

> **WhatsApp outreach toolkit for Brandex** — manage contacts, assign unique message variations, track send status, and open pre-filled `wa.me` chats for Tax Year 2026 return reminders.

Built as a **pnpm monorepo**: Express API + Postgres (Drizzle) + React dashboard, with **327 unique Urdu/English message variations** so each client gets a slightly different text (reduces spam-pattern risk).

## Topics / Keywords

`customer-outreach` `whatsapp` `messaging` `tax-return` `fbr` `tax-year-2026` `brandex` `pakistan` `urdu` `message-variations` `contacts` `csv-import` `typescript` `react` `express` `drizzle` `postgresql` `pnpm` `openapi` `orval` `automation` `custom-automation`

---

## What is this?

A **manual-assist WhatsApp campaign system** for tax consultants:

1. Import or add clients (name + phone)
2. Each contact gets a **variation index** (0–326) into a pool of **327** message templates
3. Click **Send** → opens WhatsApp Web/app with that contact’s unique message pre-filled
4. Status is tracked: `pending` · `sent` · `failed` · `skipped`
5. Dashboard shows campaign progress (Mission Control)

This is **not** an unattended bulk-sender. Messages are opened one-by-one via official `wa.me` links so a human still confirms send in WhatsApp.

### Campaign focus

**Tax Year 2026 Tax Return filing reminders** — bilingual (Roman Urdu + English) copy about early filing, policy changes, and late-filing penalties (up to Rs 25,000), signed as Brandex contacts.

---

## Features

| Area | Capability |
|------|------------|
| **Contacts** | Add manual · CSV paste import · search · status filter · delete |
| **Dispatch** | One-click **Send** → `wa.me/{phone}?text=...` with assigned variation |
| **Variations** | 327 combinatorial templates (openings × salutations × body lines × CTAs × closings) |
| **Statuses** | pending / sent / failed / skipped (manual override via menu) |
| **Dashboard** | Totals, completion %, sent/pending/failed/skipped |
| **Messages page** | Browse variation library |
| **API** | Full CRUD + bulk import + stats (OpenAPI → Orval client) |
| **Data assets** | Pre-generated CSV/TXT of all 327 variations + Excel workbook |

---

## Message variation engine

Located in `artifacts/whatsapp-dashboard/src/lib/messages.ts`:

- **Openings** (Assalam-o-Alaikum, AoA, Arabic, etc.)
- **Salutations** (Dear Client, Janab, …)
- **Line 1** — TY2026 filing is open
- **Line 2** — early filing / review benefit
- **Line 3** — policy changes + late penalty warning
- **CTA** — file now / contact us
- **Closing** — Brandex sign-off with contact numbers

Combinations are generated until **327** unique full messages.  
`getVariationMessage(index)` and `getWhatsAppUrl(phone, message)` power the Send button.

Root data files (same campaign content):

- `327_WhatsApp_Message_Variations.csv`
- `327_WhatsApp_Message_Variations.txt`
- `WhatsApp_Tax_Return_Outreach.xlsx`

---

## Architecture (monorepo)

```
Customer-Outreach-Suite/
├── artifacts/
│   ├── api-server/          # Express 5 API (port 5000)
│   ├── whatsapp-dashboard/  # React + Vite + Wouter UI
│   └── mockup-sandbox/      # UI sandbox / previews
├── lib/
│   ├── db/                  # Drizzle schema + Postgres client
│   ├── api-spec/            # OpenAPI 3.1 + Orval config
│   ├── api-client-react/    # Generated React Query hooks
│   └── api-zod/             # Generated Zod validators
├── scripts/
├── 327_WhatsApp_Message_Variations.*
├── WhatsApp_Tax_Return_Outreach.xlsx
├── pnpm-workspace.yaml
└── package.json
```

| Package | Role |
|---------|------|
| `@workspace/api-server` | REST API |
| `@workspace/whatsapp-dashboard` | Operator UI |
| `@workspace/db` | `contacts` table (Drizzle) |
| `@workspace/api-spec` | OpenAPI source of truth |
| `@workspace/api-client-react` | Typed fetch + React Query |
| `@workspace/api-zod` | Request/response validation |

---

## Data model

### `contacts` (Postgres / Drizzle)

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial | PK |
| `name` | text | Client name |
| `phone` | text | WhatsApp number |
| `status` | text | `pending` \| `sent` \| `failed` \| `skipped` (default pending) |
| `variation_index` | integer | 0–326 into message pool |
| `notes` | text | Optional internal notes |
| `created_at` | timestamp | |

On **create**, variation is random `0–326`.  
On **bulk import**, indices are assigned sequentially with modulo 327.

---

## API (summary)

Base path: `/api` (see `lib/api-spec/openapi.yaml`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/healthz` | Health |
| GET | `/contacts?status=&search=` | List / filter |
| POST | `/contacts` | Create one |
| POST | `/contacts/import` | Bulk import `{ contacts: [{name, phone}] }` |
| PATCH | `/contacts/{id}` | Update name/phone/status/notes |
| DELETE | `/contacts/{id}` | Delete |
| GET | `/stats` | `{ total, sent, pending, failed, skipped }` |

Regenerate clients after OpenAPI changes:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Dashboard routes (UI)

| Path | Page |
|------|------|
| `/` | Mission Control (stats + progress) |
| `/contacts` | Contacts & Dispatch (table, import, send) |
| `/messages` | Message variations browser |

---

## Getting started

### Prerequisites

- **Node.js 20+** (repo notes Node 24)
- **pnpm** (required — `preinstall` rejects npm/yarn)
- **PostgreSQL** and `DATABASE_URL`

### Install

```bash
git clone https://github.com/0utLawzz/Customer-Outreach-Suite.git
cd Customer-Outreach-Suite
pnpm install
```

### Database

```bash
# Set DATABASE_URL in the environment
pnpm --filter @workspace/db run push   # push schema (dev)
```

### Run

```bash
# API (port 5000)
pnpm --filter @workspace/api-server run dev

# Dashboard (Vite)
pnpm --filter @workspace/whatsapp-dashboard run dev
```

Point the dashboard at the API (via Vite proxy or env as configured in `artifacts/whatsapp-dashboard/vite.config.ts`).

### Workspace scripts

| Command | Description |
|---------|-------------|
| `pnpm run typecheck` | Typecheck all packages |
| `pnpm run build` | Typecheck + build |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API client + Zod |
| `pnpm --filter @workspace/db run push` | Apply Drizzle schema |

---

## Typical operator workflow

1. Open **Contacts** → **Import CSV** (`Name, Phone` per line) or **Add Manual**
2. Filter by **Pending**
3. Click **Send** on a row → WhatsApp opens with unique variation
4. Confirm send in WhatsApp; status auto-marks **sent**
5. Use the ⋮ menu for Failed / Skipped / reset to Pending
6. Watch **Mission Control** for campaign % complete

---

## Stack

| Layer | Tech |
|-------|------|
| Monorepo | pnpm workspaces |
| API | Express 5, Pino, esbuild |
| DB | PostgreSQL, Drizzle ORM, drizzle-zod |
| Contracts | OpenAPI 3.1, Orval, Zod v4 |
| UI | React, Vite, Wouter, TanStack Query, shadcn/ui, Tailwind |
| Messaging | Client-side variation pool + `wa.me` deep links |

---

## Compliance note

- Use only for **legitimate clients** who expect tax-related communication from your firm.
- Respect WhatsApp’s terms; prefer human-confirmed sends (as this app does) over automated spam.
- Keep contact lists private; do not commit production client CSVs with PII.

---

## License

MIT — see [LICENSE](LICENSE).

Please also read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## Author

**Nadeem (OutLawZ)**  
Custom Automation Specialist  

📧 Contact: [net2outlawzz@gmail.com](mailto:net2outlawzz@gmail.com)  
🔗 GitHub: [0utLawzz](https://github.com/0utLawzz)  
📦 Repo: [0utLawzz/Customer-Outreach-Suite](https://github.com/0utLawzz/Customer-Outreach-Suite)

---

*Need custom WhatsApp outreach tools, tax-season campaigns, or client communication automation? Contact me.*
