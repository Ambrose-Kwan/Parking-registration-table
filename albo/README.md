# Albo · Community (F4-1)

HCI prototype for the Albo **Smart Community Feed** (F4-1), driven by a single mock data source.

## Part 1 focus

- Global `PostItem` schema + `postsData` in `src/data/posts.ts`
- F4-1 feed renders only from that array (no hardcoded card fields)
- Unique `avatarUrl` / `imageUrl` per post (no shared duplicate assets)
- Category chips aligned to `recipes | workouts | places` (no Fitness/Explore tag clash)
- Micro-interactions: segment tabs, category filters, like + save toggles with tap feedback

## Run

```bash
cd albo
npm install
npm run dev
```

## Stack

Vite · React 19 · TypeScript · plain CSS (Figma tokens)
