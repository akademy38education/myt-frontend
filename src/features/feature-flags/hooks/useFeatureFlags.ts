import { useQuery } from "@tanstack/react-query";
import { featureFlagsService } from "../services/featureFlagsService";

export function useFeatureFlags() {
  return useQuery({
    queryKey: ["feature-flags"],
    queryFn: () => featureFlagsService.get(),
  });
}
