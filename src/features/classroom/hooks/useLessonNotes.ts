import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LessonParticipantRole } from "@myt/shared";
import { lessonNotesService } from "../services/lessonNotesService";

export function useLessonNotes(bookingId: string, role: LessonParticipantRole) {
  return useQuery({
    queryKey: ["lesson-notes", bookingId, role],
    queryFn: () => lessonNotesService.get(bookingId, role),
    enabled: Boolean(bookingId && role),
  });
}

export function useSaveLessonNote(bookingId: string, role: LessonParticipantRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visibility, body }: { visibility: "private" | "shared"; body: string }) => lessonNotesService.save(bookingId, role, visibility, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lesson-notes", bookingId, role] }),
  });
}
