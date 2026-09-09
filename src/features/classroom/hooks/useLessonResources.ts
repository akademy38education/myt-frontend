import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LessonParticipantRole, LessonResource, LessonResourceInput } from "@myt/shared";
import { lessonResourcesService } from "../services/lessonResourcesService";

export function useLessonResources(bookingId: string) {
  return useQuery({
    queryKey: ["lesson-resources", bookingId],
    queryFn: () => lessonResourcesService.list(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useAddLessonResource(bookingId: string, role: LessonParticipantRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LessonResourceInput) => lessonResourcesService.add(bookingId, role, input),
    onSuccess: (resource) => {
      // The lesson-room socket also echoes this resource back to the uploader
      // (see useLessonRealtime's "lesson:resource-shared" handler), so this
      // must dedupe by id rather than always appending, whichever arrives first.
      queryClient.setQueryData(["lesson-resources", bookingId], (current: LessonResource[] | undefined) => {
        if (!current) return [resource];
        return current.some((r) => r.id === resource.id) ? current : [...current, resource];
      });
    },
  });
}
