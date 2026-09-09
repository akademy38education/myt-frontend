import { useQuery } from "@tanstack/react-query";
import { adminSettingsService } from "../services/adminSettingsService";

export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => adminSettingsService.get(),
  });
}
