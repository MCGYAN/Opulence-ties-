# Store Template

> Ghana storefront starter — replace the `YOUR_*` placeholders, then launch.

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in .env.local, then:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase keys, the shop renders the sample catalog in `lib/mock-catalog.ts`.

## Environment Variables

Copy `.env.example` to `.env.local` and set your Supabase, Moolre, Resend, and app URL values.

## Customization

See [CUSTOMIZE.md](./CUSTOMIZE.md) and [public/ASSETS_GUIDE.md](./public/ASSETS_GUIDE.md).

Brand name, contact details, hero copy, and reviews live in `lib/site-brand.ts`. Colors live in `tailwind.config.js` and `app/globals.css`.

## Deployment

Set all environment variables on your host (e.g. Vercel), then:

```bash
npm run build
```

## License

See [LICENSE](./LICENSE).
