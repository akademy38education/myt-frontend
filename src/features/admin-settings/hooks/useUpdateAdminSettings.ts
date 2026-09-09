import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminSettingsService } from "../services/adminSettingsService";
import type { PlatformSettingsInput } from "../types";

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PlatformSettingsInput) => adminSettingsService.update(input),
    onSuccess: (settings) => {
      queryClient.setQueryData(["admin-settings"], settings);
      toast.success("Settings saved");
    },
    onError: () => {
      toast.error("We couldn't save these settings. Please try again.");
    },
  });
}
