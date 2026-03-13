## Plan: Digital Al‑Quran App (Draft)

TL;DR — Create a React + Vite + TypeScript app (Bun-targeted) with Tailwind and Zustand, using a layered architecture. Implement a reusable `glass-card` pattern, a small proxy to avoid CORS, client-side search, persisted qari/toggles/bookmarks, and responsive pages (`/` and `/surah/:id`) per your spec. Key decisions: scaffold full project, target Bun, include a lightweight proxy, persist bookmarks in `localStorage`.

**Steps**
1. Project scaffold
   - Create project manifest and Vite app, Tailwind, and Bun scripts. Files to add: [package.json], [vite.config.ts], [tsconfig.json], [index.html], [tailwind.config.cjs], [postcss.config.cjs].
   - Dev scripts: `bun install`, `bun dev`, `bun build`, `bun start:proxy`.
2. Global styles & tokens
   - Add `src/index.css` with Google fonts import, Tailwind base, `glass-card` class, custom scrollbar, color variables, and typography.
   - Add Tailwind config to expose palette and safelist Arabic fonts.
3. Models
   - Add `src/models/surah.model.ts` with `Surah`, `SurahDetail`, `AudioFull`, `ApiResponse` (as provided).
   - Add `src/models/ayah.model.ts` with `Ayah` if you prefer separate file.
4. Constants
   - Add `src/constants.ts` with `API_BASE = 'https://equran.id/api/v2'`, route paths, and `QARI_MAP` (key→label).
5. Service layer
   - Implement `src/services/quran.service.ts` with `fetchAllSurah()` and `fetchSurahDetail(id)` using `fetch`. Respect `ApiResponse<T>`, throw human-friendly errors. Allow overriding the base URL (so proxy can be used by changing `API_BASE`).
6. Proxy server (CORS + reliability)
   - Add a small Bun HTTP proxy at `server/proxy.ts` that forwards `/api/*` to `https://equran.id/api/v2/*`, applies CORS headers, and basic caching headers. Add `bun run server/proxy.ts` script.
7. Zustand store
   - Implement `src/stores/quran.store.ts` with the specified state and actions. Persist `selectedQari`, `showTransliteration`, `showTranslation`, and `bookmarks` to `localStorage`. Expose selectors for `surahList` / `selectedSurah`.
8. Controllers
   - Add `src/controllers/useQuranController.ts` custom hook:
     - `loadSurahList()` — uses `quran.service.fetchAllSurah()` and store setters; no repeated fetch if cached.
     - `loadSurahDetail(id)` — fetches and sets `selectedSurah`.
     - Manage loading/error flags and return async statuses.
9. UI primitives
   - Create `src/components/GlassCard.tsx` wrapper that applies the `glass-card` class and hover behavior.
   - Add utility components: `src/components/Navbar.tsx`, `src/components/SearchBar.tsx`, `src/components/Spinner.tsx`, `src/components/ErrorView.tsx`.
10. SurahCard & AyahCard
    - Implement `src/components/SurahCard.tsx` with Cupertino Liquid Glass design and navigation to `/surah/:nomor`. Use Amiri font for Arabic.
    - Implement `src/components/AyahCard.tsx` supporting play, bookmark, copy, share actions, and `dir="rtl" lang="ar"`. Audio handling: keep a single `Audio` instance in a `useRef` (in controller or component) and stop previous playback before starting new.
11. Pages & routing
    - Add `src/views/HomePage.tsx`: hero section (full viewport) with gradient lights, CTA buttons (smooth scroll to surah list via `useRef`), feature cards, surah list with client-side filter and responsive grid (1/2/3 columns), stats row.
    - Add `src/views/SurahDetailPage.tsx`: two-column layout with left sidebar list (reuse store data) and main content:
      - Header glass card with `dangerouslySetInnerHTML` for `deskripsi`.
      - Control bar for ayah filter, qari selector (from `QARI_MAP`), toggles for transliteration/translation, and `Play Audio Full` (plays `selectedSurah.audioFull[selectedQari]`).
      - Map `ayat` to `AyahCard`s. Highlight currently playing ayah.
      - Footer navigation for previous/next surah using `useNavigate`.
    - Add top-level `src/App.tsx` with `BrowserRouter`, routes `/` → `HomePage`, `/surah/:id` → `SurahDetailPage`.
    - Bootstrap in `src/main.tsx` and mount CSS.
12. UX details & accessibility
    - Ensure `dir="rtl"` and `lang="ar"` for Arabic blocks.
    - Keyboard focus states for cards and controls.
    - Loading skeletons for surah list and detail.
13. Persisted features
    - Save qari/toggles and bookmarks to `localStorage`.
    - Client-side search: filter on `namaLatin`, `nama`, `nomor`, and `arti` using normalized matching.
14. Error handling & tests
    - Centralize API error messages and show `ErrorView` in UI.
    - Add minimal unit tests for service parsing (optional).
15. Docs & scripts
    - Add `README.md` with setup: `bun install`, `bun dev` (frontend), `bun run server/proxy.ts` (proxy). Include notes about CORS and how to switch between direct API vs proxy by toggling `API_BASE`.

**Verification**
- Install dependencies: `bun install`
- Run proxy: `bun run server/proxy.ts` (or `bun dev` if proxy integrated)
- Start dev server: `bun dev`
- Manual checks:
  - Visit `/` — hero, CTA scroll to surah list, 114 surahs rendered, search works.
  - Click a surah — navigates to `/surah/:id`, loads details, audio playback works, toggles persist across navigation.
  - Play an ayah then play another — previous audio stops and only the new one plays.
  - Bookmarks persist after reload.
  - Mobile/responsive: surah grid 1/2/3 columns per breakpoint.
  - Ensure Arabic renders with proper font, size, and right alignment.
- API test: toggle `API_BASE` to direct `https://equran.id/api/v2` then test network console for CORS; default should use local proxy to avoid CORS issues.

**Decisions**
- Project scaffold: include full scaffold (you chose: Yes).
- Package manager: target Bun with Bun scripts and lockfile.
- API handling: include a lightweight proxy to avoid CORS (you chose: Add simple proxy).
- Bookmarks: persisted to `localStorage` (you chose: Yes).

Next step I propose: I can now produce the exact file-by-file implementation plan (detailed contents per file) and a runnable scaffold (all files and scripts) ready to implement. Want me to generate that full file scaffold now?
