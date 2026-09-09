import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { tutorsService } from "../services/tutorsService";

/** Resolves the logged-in tutor's own `TutorProfile` — `tutorsService.getById` accepts either a profile id or the owning user id, so this can be called with just `user.id`. */
export function useCurrentTutorProfile() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["tutors", "me", user?.id],
    queryFn: () => tutorsService.getById(user!.id),
    enabled: Boolean(user?.id),
  });

  return { ...query, tutorId: query.data?.id ?? "" };
}
