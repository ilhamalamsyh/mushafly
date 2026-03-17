## Plan: Imsakiyah Page Integration

Build a new `Jadwal Imsakiyah` feature at `/imsakiyah` using the repo’s existing architecture (`views`, `controllers`, `models`, `services`, Zustand store), while preserving current Quran features. Use class-based dark mode, responsive layout, and API-driven dependent dropdowns (provinsi -> kabkota -> jadwal) with robust loading/error handling.

**Steps**

1. Phase 1 — Foundations and contracts
2. Add route constant in `src/constants.ts` and include new route path `/imsakiyah`.
3. Add new page route in `src/App.tsx` wrapped with existing `PageWrapper`, without changing existing `/` and `/surah/:id` behavior.
4. Define API/data contracts in `src/models/imsakiyah.model.ts` using requested interfaces (`ImsakiyahEntry`, `ImsakiyahData`, `ApiResponse<T>`).
5. Add API service layer in `src/services/imsakiyah.service.ts` with `getProvinsi`, `getKabkota`, `getJadwal`, reusing current fetch + parse style and `finally`-safe loading semantics. Ensure POST payloads follow API spec exactly.
6. Phase 2 — State orchestration
7. Create dedicated Zustand store `src/stores/imsakiyah.store.ts` for page-local-but-persistent-safe state (dropdown options, selected values, jadwal, loading flags, active tab, error). Keep theme usage tied to existing `useQuranStore` to avoid duplicate theme sources. _depends on 4-5_
8. Create controller hook `src/controllers/useImsakiyahController.ts` encapsulating all async flows:
9. `loadProvinsi()` on mount.
10. `onProvinsiChange(provinsi)` resets `selectedKabkota`, `kabkotaList`, `jadwal`, `error`, then loads kabkota.
11. `onKabkotaChange(kabkota)` sets selection and triggers jadwal fetch when both selections are present.
12. `retryLastAction()` for retry button routing to latest failed operation.
13. Guard against stale responses by validating current selection before applying async results.
14. Phase 3 — UI components (imsakiyah feature set)
15. Add feature component folder `src/components/imsakiyah/` and implement:
16. `ProvinsiSelect.tsx`: controlled select with disabled/loading text `Memuat...` and dark/light classes.
17. `KabkotaSelect.tsx`: disabled if no provinsi, loading, or empty options; controlled select with loading text.
18. `JadwalTable.tsx`: 30-row capable table, sticky header, horizontal mobile scroll (`overflow-x-auto`), today-row highlight using amber accent.
19. `TodayCard.tsx`: visual card/grid for current day values with icons. Use `lucide-react` if available/added; fallback to unicode labels if icon import fails. Show graceful empty message if today not found.
20. `EmptyState.tsx`: pre-selection placeholder with dashed border and instructional text in Bahasa Indonesia.
21. `LoadingState.tsx`: skeleton pulse placeholders for table/card area.
22. Phase 4 — Page composition
23. Implement `src/views/ImsakiyahPage.tsx` integrating controller/store and all components:
24. Header/title + subtitle, dark/light-aware design in requested palette.
25. Dropdown row (stack mobile, 2-column tablet, expanded desktop).
26. Error banner with retry (`Coba Lagi`) below filters.
27. Tab switch (`Jadwal Lengkap` | `Hari Ini`) and conditional render (`JadwalTable`/`TodayCard`).
28. Footer + API docs CTA link text exactly in Bahasa Indonesia.
29. Keep page-level transitions (`transition-colors duration-300`, fade-in utility usage consistent with project).
30. Phase 5 — Theme and style extension
31. Extend `src/index.css`/Tailwind-safe utility classes only as needed for Ramadhan visual direction (dark default navy + amber accents, light parchment + amber contrast) while preserving existing app look and not regressing current pages.
32. Ensure all new text uses explicit light + dark classes (no dark-only class without light baseline).
33. If needed, add tiny component-level class helpers for repeated styling (tabs, section cards, banner states).
34. Phase 6 — Optional dependency and wiring
35. Add `lucide-react` only if not already present and used by `TodayCard`. _parallel with 15-21 once component API is fixed_
36. Phase 7 — Validation and hardening
37. Validate interaction rules:
38. Initial mount fetches provinsi.
39. Kabkota select disabled until provinsi set and options loaded.
40. Provinsi change resets kabkota + jadwal and fetches kabkota.
41. Kabkota selection auto-fetches jadwal.
42. Retry button works from error state.
43. Validate responsive behavior on mobile/tablet/desktop and both themes.
44. Validate accessibility basics (labels, disabled states, focus rings, table semantics, aria-live where needed).

**Relevant files**

- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/App.tsx` — register `/imsakiyah` route with `PageWrapper`.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/constants.ts` — add route constant.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/models/imsakiyah.model.ts` — API + schedule types.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/services/imsakiyah.service.ts` — fetch API methods and response parsing.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/stores/imsakiyah.store.ts` — feature state.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/controllers/useImsakiyahController.ts` — orchestrate loading/reset/fetch rules.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/views/ImsakiyahPage.tsx` — page assembly and behavior.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/components/imsakiyah/ProvinsiSelect.tsx` — provinsi dropdown.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/components/imsakiyah/KabkotaSelect.tsx` — kabkota dropdown.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/components/imsakiyah/JadwalTable.tsx` — complete schedule table.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/components/imsakiyah/TodayCard.tsx` — today summary card.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/components/imsakiyah/EmptyState.tsx` — initial placeholder.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/components/imsakiyah/LoadingState.tsx` — loading skeleton.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/src/index.css` — optional palette/utilities adjustments.
- `/home/ilham-osa/Dev/ilham-dev/vibe-coding/musahfly/package.json` — optional `lucide-react` dependency.

**Verification**

1. Run type/build checks to ensure no regressions and all new files compile.
2. Manual flow test: open `/imsakiyah` -> provinsi loads -> pick provinsi -> kabkota loads and enables -> pick kabkota -> jadwal appears automatically.
3. Toggle tabs and verify `Hari Ini` card data matches today row in full table.
4. Toggle dark/light theme and verify text contrast, card backgrounds, borders, and accent behavior match spec.
5. Test mobile width (<640): stacked dropdowns, scrollable table, sticky header remains readable.
6. Simulate API failure and confirm error banner + `Coba Lagi` recovers.

**Decisions**

- Use existing project architecture (`views/controllers/models/services`) instead of introducing parallel `pages/hooks/types` folders to keep codebase consistent.
- Use route `/imsakiyah`.
- Add `lucide-react` only if required by final TodayCard implementation.
- Keep existing Quran routes/components unchanged (explicit non-goal: refactoring legacy pages).

**Further Considerations**

1. Today highlight currently uses `new Date().getDate()` only; if month rollover or non-Ramadhan dates matter, future enhancement can map actual Gregorian-to-Ramadhan day from API metadata.
2. If API endpoint differs from current `/api` proxy base, add a dedicated env key for imsakiyah base URL to avoid coupling with eQuran endpoints.
