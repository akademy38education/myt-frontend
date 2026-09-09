import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TutorSettingsInput, UpdateTutorProfileInput } from "@myt/shared";
import { tutorsService } from "../services/tutorsService";

export function useUpdateTutorProfile(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTutorProfileInput) => tutorsService.updateProfile(tutorId, input),
    onSuccess: (tutor) => {
      queryClient.setQueryData(["tutors", "me", tutor.userId], tutor);
      queryClient.setQueryData(["tutors", tutorId], tutor);
    },
  });
}

export function useUpdateTutorSettings(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TutorSettingsInput) => tutorsService.updateSettings(tutorId, input),
    onSuccess: (tutor) => {
      queryClient.setQueryData(["tutors", "me", tutor.userId], tutor);
      queryClient.setQueryData(["tutors", tutorId], tutor);
    },
  });
}
