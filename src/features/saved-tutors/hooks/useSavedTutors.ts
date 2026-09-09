import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { savedTutorsService } from "../services/savedTutorsService";

export function useSavedTutors() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["saved-tutors"],
    queryFn: () => savedTutorsService.list(),
    enabled: isAuthenticated,
  });
}
