import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savedTutorsService } from "../services/savedTutorsService";

/** Save/remove a single tutor from the current user's saved list, refreshing the saved-tutors query on success. */
export function useToggleSavedTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tutorId, isSaved }: { tutorId: string; isSaved: boolean }) => {
      if (isSaved) await savedTutorsService.unsave(tutorId);
      else await savedTutorsService.save(tutorId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-tutors"] });
    },
  });
}
