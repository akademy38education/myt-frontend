# earnings feature

**Status:** scaffolded foundation — not yet implemented.

**Responsibility:** Tutor earnings ledger and payout history view.

When implementing, follow the pattern used by the reference features (`students`, `tutor-search`, `bookings`): a `services/*Service.ts` with a mock/real-API switch on `env.VITE_USE_MOCK_API`, TanStack Query hooks in `hooks/`, presentational pieces in `components/`, and a single `index.ts` barrel export. Pages import only from the barrel.
