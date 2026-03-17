# Plan: Kumpulan Doa Harian Feature (List + Detail Pages)

## TL;DR

Build two pages for browsing and viewing Islamic daily prayers (Doa):

1. **DoaListPage** (`/doa`) — Card grid with search + dual filters (grup, tag), client-side filtering on top of server-side filters
2. **DoaDetailPage** (`/doa/:id`) — Full prayer detail with 4 text blocks (Arabic RTL, transliteration, translation, source) + copy/share actions

Architecture mirrors existing patterns: **Zustand store** (state) → **Service layer** (API calls) → **Controller hook** (orchestration) → **Components** (UI). No external toast library; lightweight custom toast utility for copy/share feedback. Emerald accent (#10b981) throughout. Total: 19 new files + 3 modifications (routing + navbar + types).

---

## Implementation Phases (Parallelizable)

### Phase 1: Foundation (Types, Service, Store, Controller)

_Can run in parallel with all other phases after completion_

1. Create `src/types/doa.ts`
   - Export: `DoaItem` interface (id, grup, nama, ar, tr, idn, tentang, tag)
   - Export: `DoaListResponse` interface
   - Export: `DoaDetailResponse` interface

2. Create `src/services/doaService.ts`
   - Function: `getAllDoa(params?: { grup?, tag? })` → fetches with query params
   - Function: `getDoaById(id: number)` → fetches single doa
   - Standardized error handling (check status field for 'error')

3. Create `src/stores/doa.store.ts` (Zustand)
   - State: `doaList[]`, `allDoa[]` (client-side filtered copy), `selectedGrup`, `selectedTag`, `searchQuery`, `isLoading`, `error`
   - Derived: `grupList` (unique grupos from allDoa), `tagList` (flattened unique tags)
   - Setters: `setDoaList`, `setAllDoa`, `setSelectedGrup`, `setSelectedTag`, `setSearchQuery`, `setIsLoading`, `setError`
   - Reset method: `resetFilters()` (clear grup, tag, search)

4. Create `src/controllers/useDoaListController.ts` (Hook in controllers/ folder)
   - Hook: `useDoaListController()`
   - On mount: Fetch all doa (no filters) → populate store + derive grupList/tagList
   - On `selectedGrup` or `selectedTag` change: Re-fetch with query params → update store
   - Derived: `displayedDoa` = filter allDoa by searchQuery (case-insensitive, search across: nama, idn, ar)
   - Return: All state (doaList, displayedDoa, grupList, tagList, searchQuery, selectedGrup, selectedTag, isLoading, error) + handlers (setters) + refetch method

5. Create `src/controllers/useDoaDetailController.ts`
   - Hook: `useDoaDetailController(id: number)`
   - On mount/id change: Fetch doa by ID
   - Return: doa, isLoading, error

**Rationale:** All foundation work independent; controllers depend on service+store only.

---

### Phase 2: Toast Utility (Reusable across pages)

_Can run in parallel with Phase 1_

1. Create `src/components/ui/Toast.tsx`
   - React component: accepts `message: string, type: 'success' | 'error', duration?: number`
   - Display logic: bottom-right on desktop (≥640px), bottom-center on mobile (<640px)
   - Auto-dismiss: defaults to 2500ms
   - Styling: Emerald accent for success, red for error
   - Animation: Fade-in from bottom + fade-out on dismiss

2. Create `src/hooks/useToast.ts` (Context-based or simple state)
   - Export: `useToast()` hook → returns `{ showToast: (msg, type) => void }`
   - Internal state: manages queue of active toasts
   - Usage: `const { showToast } = useToast(); showToast('Doa copied!', 'success');`

3. Wrap app in Toast provider (update App.tsx)
   - Add `<ToastProvider>` at root level or use context wrapper

**Rationale:** Toast isolated and reusable; Phase 2 independent of Phase 1.

---

### Phase 3: List Page Components (UI Layer)

_Depends on Phase 1 completion; can parallelize internal components_

1. Create `src/components/doa/DoaCard.tsx`
   - Props: `DoaCardProps { doa: DoaItem, onBaca: (id) => void, onBagikan: (doa) => void }`
   - Structure:
     - Header: Grup badge (emerald bg/20, emerald text)
     - Title: Doa nama (bold, emerald-500, 1-2 lines)
     - Preview: `tentang` field (line-clamp-3, muted text, text-sm)
     - Tags: inline pills (emerald bg/10, text emerald-400, comma-separated)
     - Actions: Full-width "📖 Baca" button (emerald bg, white text) + share icon-only button (secondary)
   - Card styling: Left border 4px emerald, hover: scale-up + border glow
   - Dark/light mode: Conditional card bg + text colors

2. Create `src/components/doa/GrupSelect.tsx`
   - Dropdown component: controlled value
   - Props: `{ value: string, onChange: (grup: string) => void, options: string[] }`
   - Default: "Semua Kategori"
   - Styling: Emerald focus ring, match existing select patterns

3. Create `src/components/doa/TagSelect.tsx`
   - Same as GrupSelect but for tags
   - Default: "Semua Tag"

4. Create `src/components/doa/DoaSearchBar.tsx`
   - Controlled input with debounce (300ms)
   - Props: `{ searchQuery: string, onSearch: (q: string) => void }`
   - Features: Search icon, clear button (×) when value exists
   - Placeholder: "Cari doa berdasarkan nama, isi, atau kategori..."
   - Focus ring: emerald-500

5. Create `src/components/doa/DoaEmptyState.tsx`
   - Shown when: filtered results = 0
   - Content: Icon (⏰) + "Doa tidak ditemukan" + "Coba ubah filter atau cari kata kunci lain"
   - Styling: Centered, muted colors, dashed emerald border

6. Create `src/components/doa/DoaListSkeleton.tsx`
   - Grid of 6 skeleton card placeholders (matching DoaCard dimensions)
   - Pulse animation using Tailwind's `animate-pulse`
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop

**Rationale:** Components independent; can code in parallel once props are defined.

---

### Phase 4: List Page (Main Composition)

_Depends on Phase 3 completion_

1. Create `src/views/DoaListPage.tsx`
   - Component: Assemble all subcomponents from Phase 3
   - Structure:
     - **Hero section**: Title "Kumpulan Doa Harian", subtitle, badges (227 Doa, 44 Kategori) — all emerald accents
     - **Search bar**: Full width, debounced
     - **Filter row**: 2-column (Grup + Tag selects) on desktop/tablet, stacked on mobile
     - **Result count**: "Menampilkan X dari Y doa"
     - **Error banner**: If `error` state, show ErrorView-style with "Coba Lagi" button
     - **Conditional rendering**:
       - If `displayedDoa.length === 0` → DoaEmptyState
       - Else if `isLoading && doaList.length === 0` → DoaListSkeleton
       - Else → DoaCard grid (3 cols desktop, 2 col tablet, 1 col mobile)
     - **Footer**: "Sumber data: Bimas Islam Kementerian Agama RI" — match existing pattern
   - Integration: Call `useDoaListController()` on mount, pass state/handlers to subcomponents
   - Navigation: "Baca" button → `navigate(`/doa/${doa.id}`)`

**Rationale:** Composition layer after all subcomponents ready; orchestrates data flow.

---

### Phase 5: Detail Page Components (UI Layer)

_Can run in parallel with Phase 3/4; depends on Phase 1 (types/service)_

1. Create `src/components/doa/ArabicTextBlock.tsx`
   - Props: `{ text: string }`
   - Features: `dir="rtl"`, font family "Amiri" (from Google Fonts)
   - Styling: text-3xl desktop / text-2xl mobile, generous line-height, rounded container with emerald accent
   - Text color: light mode friendly

2. Create `src/components/doa/TransliterasiBlock.tsx`
   - Props: `{ text: string }`
   - Styling: italic, muted color (text-slate-400 dark, text-slate-600 light), text-base, leading-relaxed

3. Create `src/components/doa/TerjemahanBlock.tsx`
   - Props: `{ text: string }`
   - Styling: text-justify, text-base, leading-relaxed, neutral colors

4. Create `src/components/doa/KeteranganAccordion.tsx`
   - Props: `{ text: string }`
   - Features: Collapsible section (expanded by default on desktop ≥lg, collapsed default on mobile <lg)
   - Header: "ⓘ Keterangan & Dalil" with chevron icon (rotate based on open state)
   - Content: `whitespace-pre-line` (preserve newlines from API), text-sm, muted color
   - Animation: max-height transition for smooth expand/collapse
   - Styling: Teal left border accent

5. Create `src/components/doa/DoaActionButtons.tsx`
   - Props: `{ doa: DoaItem }`
   - Button 1: "Salin" — Copies formatted text to clipboard
     - Format:

       ```
       {nama}

       {ar}

       {tr}

       {idn}
       ```

     - On success: `showToast('Doa berhasil disalin!', 'success')`
     - On error: `showToast('Gagal menyalin', 'error')`
   - Button 2: "Bagikan" — Shares via Web Share API or falls back to copy URL
     - Share payload: `{ title: nama, text: nama, url: window.location.href }`
     - On fallback (no Web Share): Copy URL + `showToast('Link berhasil disalin!', 'success')`
   - Styling: Full-width on mobile, side-by-side on desktop, outlined emerald buttons

6. Create `src/components/doa/DoaDetailSkeleton.tsx`
   - Full-page skeleton matching detail card structure
   - 4 stacked blocks (arabic, transliterasi, terjemahan, keterangan) with pulse animation

**Rationale:** Detail components independent of list components; parallelizable.

---

### Phase 6: Detail Page (Main Composition)

_Depends on Phase 5 completion; Phase 1 service ready_

1. Create `src/views/DoaDetailPage.tsx`
   - Component: Full detail view
   - Route params: Extract `id` from URL using `useParams<{ id: string }>()`
   - Parse: `parseInt(id, 10)` with validation
   - Structure:
     - **Back navigation**: "← Kembali ke Daftar Doa" link → `navigate('/doa')`
     - **Detail card**:
       - Header: Doa nama (bold, emerald), Grup badge, tags inline
       - Action buttons: "Salin" + "Bagikan" top-right
       - 4 text sections in order:
         1. ArabicTextBlock (ar)
         2. TransliterasiBlock (tr)
         3. TerjemahanBlock (idn)
         4. KeteranganAccordion (tentang) — collapsed by default on mobile, expanded on desktop
     - **Error handling**:
       - If `isLoading` → DoaDetailSkeleton
       - If `error` || `!doa` → ErrorView-style card with back button + "Doa tidak ditemukan"
   - Integration: Call `useDoaDetailController(id)` on mount
   - Accessibility: Scroll to top on component mount

**Rationale:** Composition after all UI blocks ready; integrates error states and navigation.

---

### Phase 7: Google Fonts & Tailwind Config Updates

_Independent work; can parallelize_

1. Update `index.html` `<head>`:
   - Add Google Fonts link for Amiri (`@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap')`)

2. Update `tailwind.config.ts`:
   - Add to `fontFamily`:
     ```typescript
     arabic: ['Amiri', 'serif'],
     ```

**Rationale:** Quick config updates; no dependencies.

---

### Phase 8: Routing & Navigation Integration

_Depends on Phase 4 + Phase 6 completion_

1. Update `src/constants.ts`:
   - Add to ROUTES: `doa: "/doa"`

2. Update `src/App.tsx`:
   - Import DoaListPage + DoaDetailPage
   - Register routes:
     ```typescript
     { path: "/doa", element: <PageWrapper><DoaListPage /></PageWrapper> }
     { path: "/doa/:id", element: <PageWrapper><DoaDetailPage /></PageWrapper> }
     ```

3. Update `src/components/Navbar.tsx`:
   - Import `useLocation()` to detect active route
   - Add `const isDoaActive = location.pathname === ROUTES.doa || location.pathname.startsWith(ROUTES.doa + '/')`
   - **Desktop navbar**: Add "Kumpulan Doa" link with emerald accent (bg-emerald-600)
   - **Mobile drawer**: Add "Kumpulan Doa" item with route-aware active state styling (emerald when active)
   - Auto-close drawer on navigation (existing pattern)

**Rationale:** Last step after all pages ready; needs fully rendered routes.

---

## Relevant Files & Patterns to Reference

### Existing Patterns to Reuse

- **Component structure** → [src/views/ImsakiyahPage.tsx](src/views/ImsakiyahPage.tsx) for multi-filter + cascade pattern
- **Detail page** → [src/views/SurahDetailPage.tsx](src/views/SurahDetailPage.tsx) for URL params + detail card layout
- **Service pattern** → [src/services/imsakiyah.service.ts](src/services/imsakiyah.service.ts) for error handling with `status: 'error'` checks
- **Zustand store** → [src/stores/quran.store.ts](src/stores/quran.store.ts) for cleaner state management (no immer)
- **Controller hook** → [src/controllers/useImsakiyahController.ts](src/controllers/useImsakiyahController.ts) for async orchestration
- **Card grid** → [src/views/HomePage.tsx](src/views/HomePage.tsx) for responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Search logic** → [src/views/HomePage.tsx](src/views/HomePage.tsx) for client-side debounced filtering with `useMemo()`
- **Navbar integration** → [src/components/Navbar.tsx](src/components/Navbar.tsx) (recently updated with Shalat) for route-aware active states

### Key Files to Modify

- `src/constants.ts` — Add `doa: "/doa"` route
- `src/App.tsx` — Register 2 new routes
- `src/components/Navbar.tsx` — Add Doa link + active state detection
- `index.html` — Add Google Fonts link for Amiri in `<head>`
- `tailwind.config.ts` — Add `arabic` font family

### New Files (19 total)

**Foundation (Phase 1):**

- `src/types/doa.ts`
- `src/services/doaService.ts`
- `src/stores/doa.store.ts`
- `src/controllers/useDoaListController.ts`
- `src/controllers/useDoaDetailController.ts`

**Toast (Phase 2):**

- `src/components/ui/Toast.tsx`
- `src/hooks/useToast.ts`

**List Page (Phases 3-4):**

- `src/components/doa/DoaCard.tsx`
- `src/components/doa/GrupSelect.tsx`
- `src/components/doa/TagSelect.tsx`
- `src/components/doa/DoaSearchBar.tsx`
- `src/components/doa/DoaEmptyState.tsx`
- `src/components/doa/DoaListSkeleton.tsx`
- `src/views/DoaListPage.tsx`

**Detail Page (Phases 5-6):**

- `src/components/doa/ArabicTextBlock.tsx`
- `src/components/doa/TransliterasiBlock.tsx`
- `src/components/doa/TerjemahanBlock.tsx`
- `src/components/doa/KeterangenAccordion.tsx`
- `src/components/doa/DoaActionButtons.tsx`
- `src/components/doa/DoaDetailSkeleton.tsx`
- `src/views/DoaDetailPage.tsx`

---

## Verification & Testing Plan

### Unit Tests (If Applicable)

1. **Service layer**:
   - `getAllDoa()` with/without filters returns correct structure
   - `getDoaById()` returns valid DoaItem
   - Error handling: API returns status: 'error' → throws properly

2. **Controller hooks**:
   - `useDoaListController()` fetches on mount, populates store
   - Filter changes trigger refetch with correct query params
   - Client-side search filters across nama/idn/ar fields

### Integration Tests

1. **DoaListPage**:
   - Navigate to `/doa` → page loads, displays DoaList
   - Search filters results in real-time (debounced)
   - Grup/Tag dropdown changes trigger new fetch
   - "Baca" button navigates to `/doa/:id`
   - Dark/light mode toggle works (emerald accents persist)
   - Responsive: 1 col mobile, 2 col tablet, 3 col desktop

2. **DoaDetailPage**:
   - Navigate to `/doa/1` → loads detail for ID 1
   - All 4 text blocks render (Arabic RTL verified, transliterasi italic, etc.)
   - Keterangan accordion collapses on mobile (default), expands on desktop (default)
   - "Salin" button copies formatted text to clipboard + toast shows
   - "Bagikan" button opens share dialog or copies URL (test both paths)
   - Back button navigates to `/doa`
   - Invalid ID (e.g., `/doa/999999`) → shows error state
   - Dark/light mode: emerald accents consistent

3. **Navigation**:
   - Desktop navbar has "Kumpulan Doa" link with emerald highlight
   - Mobile drawer has "Kumpulan Doa" item with active state (emerald when on /doa)
   - Link navigates to `/doa` correctly

### Manual QA

1. Mobile responsiveness tested on real devices (iPhone 12, Android)
2. Arabic RTL rendering verified (letters connect correctly, no mixed text direction)
3. Toast appear/dismiss with correct timing (2.5s)
4. Dark mode: All contrast meets WCAG AA standards
5. Search performance: 227 items filter smoothly without lag

---

## Architectural Decisions & Constraints

### Decisions Made

| Decision                                          | Rationale                                                                                      | Alternatives Rejected                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Zustand store** for state                       | Consistent with existing (Imsakiyah, Shalat) features; simpler than Context                    | Redux, useState-per-component         |
| **Service layer** fetches all doa on initial load | Client-side filtering preferred for search UX (instant results); Bimas API doesn't paginate    | Server-side pagination                |
| **emerald-500 (#10b981)** accent                  | Distinct from Surah (teal), Imsakiyah (amber), Shalat (cyan); matches "doa" green/nature theme | Any other color                       |
| **Google Fonts Amiri** for Arabic                 | Professional DIACRITIC support; native browser rendering (no JS dependency)                    | Simplified Arabic fonts, system fonts |
| **Lightweight toast utility** (custom)            | Avoids external dependency (no `sonner`, `react-hot-toast`, etc.); matches project philosophy  | Full toast library                    |
| **Collapsed Keterangan by default (mobile)**      | Reduces scroll on mobile; users rarely need source citations                                   | Always expanded                       |
| **Routes: /doa (list) + /doa/:id (detail)**       | Follows existing URL pattern (like /surah/:id); clean, predictable routing                     | Single nested route, detail as modal  |

### Constraints & Assumptions

1. **API endpoint**: `/api/doa` returns {status, data} or {status: 'error', message} — not {code, data} like some Bimas endpoints
2. **Response size**: 227 doa fits comfortably in memory (< 1MB); client-side filtering acceptable
3. **Arabic font**: Google Fonts Amiri assumed available; no offline fallback needed
4. **No pagination**: All 227 doa fetched at once; no lazy-load or infinite scroll
5. **Browser support**: CSS Grid, Fetch API, localStorage, Web Share API (graceful fallback if unsupported)
6. **Dark mode**: Uses Tailwind's `darkMode: 'class'` (existing system); does NOT follow system preference

---

## Scope & Exclusions

### Included

✅ List page with search + dual filters (grup, tag)  
✅ Detail page with 4 text blocks  
✅ Copy/share actions  
✅ Dark/light mode support  
✅ Responsive mobile design (1/2/3 cols based on breakpoint)  
✅ Toast notifications  
✅ Error handling (API failures, 404 IDs)  
✅ Navbar integration

### Explicitly Excluded

❌ Backend API development (assume endpoint exists and works)  
❌ Infinite scroll or pagination (load all 227 upfront)  
❌ User doa collections/bookmarks (not in requirements)  
❌ Offline support or caching strategy (can add later)  
❌ Advanced audio playback or multimedia (doa text-only)  
❌ A/B testing or analytics (out of scope)

---

## Timeline & Parallelization

**Sequential dependencies:**

```
Phase 1 (Foundation) [4–5 hours]
├─ Phase 3 (List components) [3–4 hours]
│  └─ Phase 4 (List page) [1–2 hours]
│
├─ Phase 5 (Detail components) [3–4 hours]  [parallel with Phase 3]
│  └─ Phase 6 (Detail page) [1–2 hours]
│
├─ Phase 2 (Toast utility) [1 hour]  [parallel with Phase 1]
│
└─ Phase 7 (Config updates) [15–30 min]  [parallel with Phase 1]

Phase 8 (Routing integration) [30 min–1 hour]  [last, needs Phases 4 & 6]

TOTAL: ~8–12 developer hours (or ~4–6 hours with parallel work)
```

**Fully parallelizable after Phase 1:**

- Phase 2, 3, 5, 7 can start simultaneously while Phase 1 completes
- Phase 4 waits only for Phase 3
- Phase 6 waits only for Phase 5
- Phase 8 waits for Phase 4 + Phase 6

---

## Further Clarifications (If Needed)

1. **API error response format**: Plan assumes `{status: 'error', message: string}` — will verify on first API call
2. **Toast positioning**: Bottom-right on desktop (≥640px), bottom-center on mobile — confirm if preferred elsewhere
3. **Keterangan whitespace**: Plan uses `whitespace-pre-line` to preserve `\n` newlines — confirm this is desired
4. **Copy format**: Plan copies with newlines between sections — adjust spacing if needed
5. **Share fallback**: If Web Share API unsupported, copies URL to clipboard — alternative: open email share, SMS, etc.?
