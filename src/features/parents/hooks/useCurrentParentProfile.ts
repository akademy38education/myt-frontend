import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { parentsService } from "../services/parentsService";

/** Resolves the logged-in parent's own `ParentProfile` — `parentsService.getById` accepts either a profile id or the owning user id, so this can be called with just `user.id`. */
export function useCurrentParentProfile(options: { enabled?: boolean } = {}) {
  const { user } = useAuth();
  const enabled = (options.enabled ?? true) && Boolean(user?.id);
  const query = useQuery({
    queryKey: ["parents", "me", user?.id],
    queryFn: () => parentsService.getById(user!.id),
    enabled,
  });

  return { ...query, parentId: query.data?.id ?? "" };
}
