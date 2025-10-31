# Short Report — Rendering Choices

**Home (`/`) — SSG**
- Rationale: Product listing is read-heavy and changes infrequently. SSG provides fast CDN-cached pages. Client-side search allows dynamic filtering without server load.

**Product Detail (`/products/[slug]`) — ISR (revalidate: 60s)**
- Rationale: Product pages need fast, static delivery but must show reasonably fresh prices and inventory. ISR regenerates pages periodically without full rebuilds.

**Dashboard (`/dashboard`) — SSR**
- Rationale: The inventory dashboard shows live stock and should reflect changes on each request; SSR ensures up-to-date data and allows simple auth later.

**Admin (`/admin`) — Client-side fetching**
- Rationale: Admin actions are interactive and require forms and immediate feedback; calling API endpoints from the client is straightforward here. API POST/PUT endpoints are protected with a simple header key.

**Data Flow**
- Frontend pages use Next.js data functions (SSG/SSR) or client-side fetch which call `/api/*`.
- API routes read/write `data/products.json` via `utils/db.ts`.

**Notes**
- File-based storage is simple but not safe for concurrent writes; for production use a DB.
- Admin protection is deliberately simple for the assignment; do not store secrets in the frontend in real apps.
