import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Booking } from "@myt/shared";
import { mockBookings } from "@/mocks";

interface MockBookingsState {
  bookings: Booking[];
  add: (booking: Booking) => void;
  update: (id: string, patch: Partial<Booking>) => Booking | undefined;
}

/** Mock-mode-only mutable booking store — mirrors what `bookingsRepository` does on the real backend, so `VITE_USE_MOCK_API=true` can exercise create/reschedule/cancel too, not just read the static seed list. */
export const useMockBookingsStore = create<MockBookingsState>()(
  persist(
    (set, get) => ({
      bookings: mockBookings,
      add: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      update: (id, patch) => {
        let updated: Booking | undefined;
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== id) return b;
            updated = { ...b, ...patch, updatedAt: new Date().toISOString() };
            return updated;
          }),
        }));
        return updated ?? get().bookings.find((b) => b.id === id);
      },
    }),
    { name: "myt-mock-bookings", storage: createJSONStorage(() => localStorage) }
  )
);
