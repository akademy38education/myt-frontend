import { UserRole } from "@myt/shared";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "@/routes/AppRoutes";
import { MaintenanceGate } from "@/components/shared/MaintenanceGate";
import { useMaintenanceStore } from "@/stores/maintenanceStore";
import { useAuthStore } from "@/stores/authStore";

export function App() {
  const maintenanceActive = useMaintenanceStore((state) => state.active);
  const isAdmin = useAuthStore((state) => state.user?.role === UserRole.ADMIN);

  // An admin must keep using the real app even during maintenance, so they can flip it back off from Settings.
  if (maintenanceActive && !isAdmin) return <MaintenanceGate />;

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
