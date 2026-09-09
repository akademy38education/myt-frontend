import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { featureFlagsService } from "../services/featureFlagsService";
import type { FeatureFlags } from "../types";

export function useUpdateFeatureFlags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: FeatureFlags) => featureFlagsService.update(patch),
    onSuccess: (flags) => {
      queryClient.setQueryData(["feature-flags"], flags);
      toast.success("Feature flag updated");
    },
    onError: () => {
      toast.error("We couldn't update this feature flag. Please try again.");
    },
  });
}
