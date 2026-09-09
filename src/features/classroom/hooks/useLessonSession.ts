import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, EndLessonInput, StartLessonInput } from "@myt/shared";
import { lessonSessionService } from "../services/lessonSessionService";

export function useLessonSession(bookingId: string) {
  return useQuery({
    queryKey: ["lesson-session", bookingId],
    queryFn: () => lessonSessionService.get(bookingId),
    enabled: Boolean(bookingId),
    refetchInterval: 15_000, // cheap fallback poll alongside the socket push, in case an event is missed
  });
}

export function useLessonParticipants(bookingId: string, booking: Booking | undefined) {
  return useQuery({
    queryKey: ["lesson-participants", bookingId],
    queryFn: () => lessonSessionService.getParticipants(bookingId, booking!),
    enabled: Boolean(bookingId && booking),
  });
}

export function useStartLesson(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: StartLessonInput) => lessonSessionService.start(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-session", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useEndLesson(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EndLessonInput) => lessonSessionService.end(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-session", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
  });
}

export function useUpdateLessonSummary(bookingId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: EndLessonInput) => lessonSessionService.updateSummary(bookingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-session", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["tutors"] }); // dashboard's unfinished-summaries count
    },
  });
}
