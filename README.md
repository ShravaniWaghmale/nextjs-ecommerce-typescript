# Next.js E‑Commerce Assignment (TypeScript, Pages Router) — Ready

## Setup

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set `ADMIN_KEY` (e.g. `ADMIN_KEY=change-me-to-a-secure-key`).

3. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Pages & Rendering Strategies

- `/` (Home) — SSG using `getStaticProps`.
- `/products/[slug]` — ISR using `getStaticProps` + `revalidate: 60`.
- `/dashboard` — SSR using `getServerSideProps`.
- `/admin` — Client-side fetching of API to create/update products.

## API

- `GET /api/products` — fetch all products
- `GET /api/products/slug/[slug]` — fetch single product by slug
- `POST /api/products` — add product (protected by `x-admin-key` header or server ADMIN_KEY)
- `PUT /api/products/[id]` — update product (protected)

## Data

Uses `data/products.json` as a simple data store. For production use a real database like MongoDB.
