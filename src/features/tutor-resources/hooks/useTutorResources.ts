import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateResourceInput } from "@myt/shared";
import { tutorResourcesService } from "../services/tutorResourcesService";

export function useTutorResources(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-resources", tutorId],
    queryFn: () => tutorResourcesService.list(tutorId),
    enabled: Boolean(tutorId),
  });
}

export function useCreateTutorResource(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateResourceInput) => tutorResourcesService.create(tutorId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tutor-resources", tutorId] }),
  });
}

export function useDeleteTutorResource(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resourceId: string) => tutorResourcesService.remove(tutorId, resourceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tutor-resources", tutorId] }),
  });
}

export function useShareTutorResource(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resourceId, studentIds }: { resourceId: string; studentIds: string[] }) => tutorResourcesService.share(tutorId, resourceId, studentIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tutor-resources", tutorId] }),
  });
}

export function useUnshareTutorResource(tutorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ resourceId, studentId }: { resourceId: string; studentId: string }) => tutorResourcesService.unshare(tutorId, resourceId, studentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tutor-resources", tutorId] }),
  });
}
