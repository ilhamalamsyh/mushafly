# Plan: Jadwal Shalat Monthly Prayer Schedule Page

## Overview

Build a **Jadwal Shalat Bulanan** page for the existing React + TypeScript + Vite project using **Tailwind CSS**.
This page displays monthly Islamic prayer schedules for all regions in Indonesia, sourced from the Bimas Islam
Kemenag RI API. The design must support **dark/light mode toggle** (consistent with the existing theme system)
and be fully **mobile responsive**.

> ⚠️ **REUSE EXISTING COMPONENTS**: The `ProvinsiSelect` and `KabkotaSelect` dropdown components were already
> built for the Imsakiyah page. **Do NOT recreate them.** Import and reuse them directly. Only create new
> components specific to this page.

---

## Design Reference

The UI uses the same dark navy/teal-accent aesthetic as the Imsakiyah page, but with a **teal/cyan accent**
(`#06b6d4`) instead of amber. Maintain visual consistency across both pages:

- Same background colors, card styles, typography, and layout structure
- Same dark/light mode behavior
- Only the accent color differs: **teal** for Shalat, **amber** for Imsakiyah

---

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (`darkMode: 'class'` already configured)
- Zustand for state management (matching Imsakiyah pattern)
- Custom hook for controller logic (matching Imsakiyah pattern)
- `fetch` for API calls (consistent with existing service layer pattern)

---

## API Integration

### Base URL

```
/api/v2/shalat
```

> Use `API_BASE` constant from `src/constants.ts` as base (same pattern as Imsakiyah service).

### 1. GET Daftar Provinsi

```
GET /api/v2/shalat/provinsi
```

**Response:**

```json
{
  "code": 200,
  "message": "Daftar provinsi berhasil diambil",
  "data": ["Aceh", "Sumatera Utara", "Jawa Barat", ...]
}
```

### 2. POST Daftar Kabupaten/Kota

```
POST /api/v2/shalat/kabkota
Content-Type: application/json

{ "provinsi": "Jawa Barat" }
```

**Response:**

```json
{
  "code": 200,
  "message": "Daftar kabupaten/kota di Jawa Barat",
  "data": ["Kab. Bandung", "Kota Bogor", ...]
}
```

### 3. POST Jadwal Shalat Bulanan

```
POST /api/v2/shalat
Content-Type: application/json

{
  "provinsi": "Jawa Barat",
  "kabkota": "Kota Bogor",
  "bulan": 3,      // 1–12, default: current month
  "tahun": 2026    // default: current year
}
```

**Response:**

```json
{
  "code": 200,
  "message": "Jadwal shalat berhasil diambil",
  "data": {
    "provinsi": "Jawa Barat",
    "kabkota": "Kota Bogor",
    "bulan": 3,
    "tahun": 2026,
    "bulan_nama": "Maret",
    "jadwal": [
      {
        "tanggal": 1,
        "tanggal_lengkap": "2026-03-01",
        "hari": "Ahad",
        "imsak": "04:25",
        "subuh": "04:35",
        "terbit": "05:52",
        "dhuha": "06:17",
        "dzuhur": "12:05",
        "ashar": "15:24",
        "maghrib": "18:13",
        "isya": "19:25"
      }
    ]
  }
}
```

---

## TypeScript Types

Add the following types to `src/types/shalat.ts` (create this new file, separate from `imsakiyah.ts`):

```typescript
export interface JadwalShalatEntry {
  tanggal: number;
  tanggal_lengkap: string; // "2026-03-01"
  hari: string; // "Kamis"
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface JadwalShalatData {
  provinsi: string;
  kabkota: string;
  bulan: number;
  tahun: number;
  bulan_nama: string;
  jadwal: JadwalShalatEntry[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

> ℹ️ If `ApiResponse<T>` is already defined globally (e.g. in existing imsakiyah types), reuse it.

---

## Page Structure & Components

### File: `src/views/JadwalShalatPage.tsx`

This is the main page component.

#### State

```typescript
const [provinsiList, setProvinsiList] = useState<string[]>([]);
const [kabkotaList, setKabkotaList] = useState<string[]>([]);
const [selectedProvinsi, setSelectedProvinsi] = useState<string>("");
const [selectedKabkota, setSelectedKabkota] = useState<string>("");
const [selectedBulan, setSelectedBulan] = useState<number>(
  new Date().getMonth() + 1,
);
const [jadwal, setJadwal] = useState<JadwalShalatData | null>(null);
const [isLoadingProvinsi, setIsLoadingProvinsi] = useState(false);
const [isLoadingKabkota, setIsLoadingKabkota] = useState(false);
const [isLoadingJadwal, setIsLoadingJadwal] = useState(false);
const [error, setError] = useState<string | null>(null);
const [activeTab, setActiveTab] = useState<"table" | "today">("table");
```

#### Behavior

- On mount: fetch provinsi list immediately
- On `selectedProvinsi` change: reset kabkota + jadwal, fetch kabkota list
- On `selectedKabkota` or `selectedBulan` change: auto-fetch jadwal if both provinsi + kabkota are set
- The `selectedBulan` dropdown is **always enabled** (does not depend on provinsi/kabkota selection)

#### Reused Components (import from existing paths)

```typescript
import ProvinsiSelect from "@/components/imsakiyah/ProvinsiSelect";
import KabkotaSelect from "@/components/imsakiyah/KabkotaSelect";
```

> Pass the relevant props: `value`, `onChange`, `options`, `isLoading`, `disabled`
> These components are already generic and require NO modifications.

---

## New Components to Create (Shalat-specific only)

### `src/components/shalat/BulanSelect.tsx`

- Dropdown to select month (1–12), always enabled
- Display Indonesian month names: Januari, Februari, Maret, ..., Desember
- Default to current month
- Same visual style as `ProvinsiSelect` / `KabkotaSelect`
- Use teal accent for focus/border states (#06b6d4)
- Icon: calendar icon (lucide-react `CalendarDays`)
- Dark/light mode aware (text-black dark:text-white)

### `src/components/shalat/JadwalShalatTable.tsx`

- Full monthly schedule table
- Columns: No, Hari, Tanggal, Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya
- **Highlight today's row** in teal when `tanggal_lengkap` matches today's date
  (`new Date().toISOString().split('T')[0]`)
- Sticky header on scroll
- Horizontally scrollable on mobile (`overflow-x-auto`)
- Alternating row backgrounds for readability
- Dark/light mode styling
- Props: rows (JadwalShalatEntry[]), highlightTanggalLengkap (today's ISO date)

### `src/components/shalat/TodayShalatCard.tsx`

- Displays today's prayer schedule as an icon grid
- Find today's entry from the jadwal array using `tanggal_lengkap`
- Show 8 prayer times: Imsak, Subuh, Terbit, Dhuha, Dzuhur, Ashar, Maghrib, Isya
- Each item: icon + label + time in monospace font
- Teal accent for highlighted/active prayer (based on current time)
- Show a "Tidak ada jadwal untuk hari ini" message if today's entry is not found
- Dark/light mode styling
- Props: jadwal (JadwalShalatData)

### `src/components/shalat/ShalatEmptyState.tsx`

- Shown before user selects location
- Clock icon (`Clock` from lucide-react) + instructional text
- Dashed teal border container (same pattern as Imsakiyah empty state)
- Text: "Pilih Lokasi Anda" + "Pilih provinsi dan kabupaten/kota untuk melihat jadwal shalat bulanan"

### `src/components/shalat/ShalatLoadingState.tsx`

- Skeleton loader for the table/card area while jadwal is fetching
- Pulse animation rows consistent with existing `LoadingState` component pattern from Imsakiyah

---

## UI & Styling Rules

### Accent Color Override (Teal for Shalat)

All amber/golden accents from the Imsakiyah page should be replaced with teal for this page:

| Element               | Imsakiyah (amber)  | Shalat (teal)     |
| --------------------- | ------------------ | ----------------- |
| Page title color      | `#f59e0b`          | `#06b6d4`         |
| Dropdown focus border | `amber-500`        | `cyan-500`        |
| Today row highlight   | `amber-500/20`     | `cyan-500/20`     |
| Badge/pill color      | amber              | cyan              |
| Icon color            | `#f59e0b`          | `#06b6d4`         |
| Empty state border    | `border-amber-500` | `border-cyan-500` |
| Button accent         | amber              | cyan              |

All other colors (background, card, text, borders) remain identical to the Imsakiyah page.

### Header Badges

Show three info badges below the title (same style as Imsakiyah page):

```
[ 517 Kab/Kota ]   [ 34 Provinsi ]   [ 2026 ] ← teal filled
```

### Layout

- Three-column dropdown row: Provinsi | Kabupaten/Kota | Bulan
- On mobile: stack vertically (single column)
- On tablet: 2-column grid, Bulan dropdown below
- On desktop: 3-column grid as per reference

### Tabs (above jadwal content area)

Two tabs: **"Jadwal Bulanan"** and **"Hari Ini"**

- "Jadwal Bulanan" → shows `JadwalShalatTable`
- "Hari Ini" → shows `TodayShalatCard`
- Active tab indicator: teal underline/fill
- Smooth transition between tabs

---

## Dropdown Behavior Rules

```
1. On page load → fetch provinsi list immediately
2. Kabupaten/Kota dropdown MUST be disabled when:
   - selectedProvinsi === ''
   - OR kabkotaList is still loading
3. Bulan dropdown is ALWAYS enabled (independent of provinsi/kabkota)
4. When provinsi changes:
   - Reset selectedKabkota to ''
   - Reset jadwal to null
   - Clear error
   - Trigger kabkota fetch
5. When both selectedProvinsi + selectedKabkota are set (and bulan is selected):
   - Auto-trigger jadwal fetch (no separate submit button)
6. When only bulan changes (provinsi + kabkota already set):
   - Re-fetch jadwal with new bulan value
7. Show loading text "Memuat..." inside dropdown while fetching
```

---

## Service Layer

### File: `src/services/shalatService.ts`

```typescript
import type { ApiResponse, JadwalShalatData } from "@/types/shalat";
import { API_BASE } from "@/constants";

const BASE_URL = `${API_BASE}/shalat`;

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}).`);
  }
  const body = (await response.json()) as ApiResponse<T>;
  if (!body || typeof body !== "object" || body.code !== 200) {
    throw new Error("Unexpected API response.");
  }
  return body.data;
};

export const getShalatProvinsi = async (): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${BASE_URL}/provinsi`);
  const data = await parseResponse<string[]>(response);
  return { code: 200, message: "ok", data };
};

export const getShalatKabkota = async (
  provinsi: string,
): Promise<ApiResponse<string[]>> => {
  const response = await fetch(`${BASE_URL}/kabkota`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi }),
  });
  const data = await parseResponse<string[]>(response);
  return { code: 200, message: "ok", data };
};

export const getJadwalShalat = async (
  provinsi: string,
  kabkota: string,
  bulan: number,
  tahun: number,
): Promise<ApiResponse<JadwalShalatData>> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provinsi, kabkota, bulan, tahun }),
  });
  const data = await parseResponse<JadwalShalatData>(response);
  return { code: 200, message: "ok", data };
};
```

---

## Custom Hook: `src/hooks/useJadwalShalat.ts`

Encapsulate all state and API logic following the same pattern as `useImsakiyahController.ts`:

**Key Features:**

- `loadProvinsi()` on mount
- `onProvinsiChange(provinsi)` → reset kabkota/jadwal → fetch new kabkota
- `onKabkotaChange(kabkota)` → if both set, auto-fetch jadwal
- `onBulanChange(bulan)` → if both provinsi+kabkota set, re-fetch jadwal
- `retryLastAction()` for error recovery
- Request-ID refs (`kabkotaRequestIdRef`, `jadwalRequestIdRef`) for stale-response guards
- Returns all state + handlers

---

## Error Handling

- Show error banner below the dropdowns if any API call fails
- Include "Coba Lagi" (retry) button
- Style: teal-tinted border with error icon (consistent with Imsakiyah error style but teal accent)
- Wrap all fetch calls in try/catch with `finally` for loading state reset

---

## File Structure (New Files Only)

```
src/
├── types/
│   └── shalat.ts                         ← NEW
├── services/
│   └── shalatService.ts                  ← NEW
├── stores/
│   └── jadwalshalat.store.ts             ← NEW (Zustand store)
├── controllers/
│   └── useJadwalShalatController.ts      ← NEW (orchestration hook)
├── components/
│   └── shalat/
│       ├── BulanSelect.tsx               ← NEW
│       ├── JadwalShalatTable.tsx         ← NEW
│       ├── TodayShalatCard.tsx           ← NEW
│       ├── ShalatEmptyState.tsx          ← NEW
│       └── ShalatLoadingState.tsx        ← NEW
└── views/
    └── JadwalShalatPage.tsx              ← NEW

// REUSED (do not modify):
src/components/imsakiyah/ProvinsiSelect.tsx
src/components/imsakiyah/KabkotaSelect.tsx
```

---

## Routing

Register the new page in the router (e.g. `src/App.tsx`):

```typescript
import JadwalShalatPage from '@/views/JadwalShalatPage';

// Add route constant to src/constants.ts:
export const ROUTES = {
  // ...existing routes...
  shalat: "/shalat",
};

// Add route in src/App.tsx:
{ path: "/shalat", element: <PageWrapper><JadwalShalatPage /></PageWrapper> }
```

---

## Additional Notes

- All text copy in **Bahasa Indonesia**
- Tahun defaults to `new Date().getFullYear()` — no tahun selector needed in the UI
- Footer identical to Imsakiyah page: `"Sumber data: Bimas Islam Kementerian Agama RI"` with external link
- `"Lihat Dokumentasi API"` button at the bottom linking to documentation
- Transitions: `transition-colors duration-300` on theme switch (consistent with Imsakiyah page)
- Table skeleton loader: same pulse pattern as Imsakiyah `LoadingState.tsx`, adapted for this table's columns
- Always show teal accents in both dark and light modes for consistency

---

## Implementation Phases

### Phase 1: Foundation (Types + Service)

Create types and API service layer following Imsakiyah patterns. These can be done in parallel with other phases.

### Phase 2: State Management

Create Zustand store and controller hook. Depends on Phase 1.

### Phase 3: UI Components

Build all 5 shalat-specific components (BulanSelect, JadwalShalatTable, TodayShalatCard, EmptyState, LoadingState).
Can run in parallel with Phase 2 after Phase 1 completes.

### Phase 4: Page Composition

Assemble main JadwalShalatPage using all components. Depends on Phases 2 & 3.

### Phase 5: Routing Integration

Wire routes in App.tsx and constants.ts. Depends on Phase 4.

---

## Verification Checklist

- [ ] TypeScript compilation: `tsc --noEmit` passes with no errors
- [ ] API calls tested (getShalatProvinsi, getShalatKabkota, getJadwalShalat return expected data)
- [ ] State flow: provinsi → kabkota → jadwal with auto-fetch
- [ ] Tab switching: "Jadwal Bulanan" ↔ "Hari Ini" toggles content
- [ ] Today's row/entry highlighted in teal
- [ ] Empty state shown before selection
- [ ] Loading state shown while fetching
- [ ] Error banner + retry button functional on API failure
- [ ] Responsive: Mobile stacked / Tablet 2-col / Desktop 3-col dropdowns
- [ ] Dark/light mode: All text, accents, backgrounds switch correctly
- [ ] Accessibility: Tab navigation works, aria-labels on interactive elements

---

## Decisions

- **Route path**: `/shalat` (short, clean)
- **State management**: Zustand store + custom controller hook (matches Imsakiyah pattern)
- **Component organization**: `src/components/shalat/` (parallel to imsakiyah folder)
- **Page location**: `src/views/JadwalShalatPage.tsx` (consistent with codebase: HomePage, SurahDetailPage, ImsakiyahPage)
- **Year handling**: Hardcoded to `new Date().getFullYear()` (no UI selector, cleaner UX)
- **Accent color**: Teal (#06b6d4) throughout for Shalat feature (distinct from Imsakiyah's amber)
- **Dropdown reuse**: ProvinsiSelect/KabkotaSelect imported as-is (already generic, no refactoring needed)
- **Types file**: Separate `src/types/shalat.ts` (not in models/ like Imsakiyah, but for consistency with new typing approach)

---

## Further Considerations

1. **Navbar Integration** — Add "Jadwal Shalat" link to mobile drawer + desktop navbar?
   - Recommendation: Defer to follow-up task (navigation changes were completed for Imsakiyah in prior work)
   - Current scope: Route registration + page build only

2. **Current Prayer Highlighting** (TodayShalatCard)
   - Approach: Compare `new Date()` time with prayer times, highlight the upcoming one
   - Implementation: Simple string time comparison (HH:MM format)
   - Future: Could add animation or pulse effect for current prayer

3. **Browse Past/Future Years** (Optional future enhancement)
   - Current: Fixed to current year, allows any month 1-12
   - Future: Add TahunSelect dropdown if user demand requires it (not in current scope)
   - Note: Ramadhan rarely scheduled >1 year in advance, so low priority
