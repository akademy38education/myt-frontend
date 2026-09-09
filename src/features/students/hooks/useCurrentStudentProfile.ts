import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { studentsService } from "../services/studentsService";

/**
 * Resolves the logged-in user's `StudentProfile` — in particular its own
 * `id`, which is what every booking/lesson/homework/etc. query below the
 * dashboard actually needs to filter by (not `user.id`). Cache this once
 * per page rather than re-deriving it — most student pages need it.
 */
export function useCurrentStudentProfile(options: { enabled?: boolean } = {}) {
  const { user } = useAuth();
  const enabled = (options.enabled ?? true) && Boolean(user?.id);
  const query = useQuery({
    queryKey: ["students", "me", user?.id],
    queryFn: () => studentsService.getProfile(user!.id),
    enabled,
  });

  return { ...query, studentId: query.data?.id ?? "" };
}
