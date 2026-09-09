import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LessonMessage, LessonParticipantRole } from "@myt/shared";
import { lessonChatService } from "../services/lessonChatService";

export function useLessonChat(bookingId: string) {
  return useQuery({
    queryKey: ["lesson-messages", bookingId],
    queryFn: () => lessonChatService.list(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useSendLessonMessage(bookingId: string, role: LessonParticipantRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => lessonChatService.send(bookingId, role, body),
    onSuccess: (message) => {
      // The lesson-room socket also echoes this message back to the sender
      // (see useLessonRealtime's "lesson:message" handler), so this must
      // dedupe by id rather than always appending, whichever arrives first.
      queryClient.setQueryData(["lesson-messages", bookingId], (current: LessonMessage[] | undefined) => {
        if (!current) return [message];
        return current.some((m) => m.id === message.id) ? current : [...current, message];
      });
    },
  });
}
