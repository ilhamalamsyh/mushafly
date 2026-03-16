# Musahfly

Digital Al-Quran app built with React + Vite + TypeScript, styled with Tailwind, state managed by Zustand, and Bun proxy for API reliability.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (persisted qari, toggles, bookmarks)
- Bun proxy server (`server/proxy.ts`)

## Setup

```bash
bun install
```

Run proxy in one terminal:

```bash
bun run start:proxy
```

Run frontend in another terminal:

```bash
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

## API Base URL

Default client API base is `/api`, intended to be proxied by Vite dev server to `http://localhost:8787`.

You can switch to direct API by setting:

```bash
VITE_API_BASE=https://equran.id/api/v2
```

## Features

- Home page hero and responsive surah grid (1/2/3 columns)
- Client-side search by `namaLatin`, `nama`, `nomor`, `arti`
- Surah detail with description, ayah filter, qari selector, transliteration/translation toggles
- Ayah-level play, bookmark, copy, share actions
- Single audio instance behavior (new play stops previous)
- Persisted preferences and bookmarks via localStorage
