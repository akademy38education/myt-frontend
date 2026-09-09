import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { RealtimeSync } from "@/realtime/RealtimeSync";
import { queryClient } from "./queryClient";

/**
 * Every cross-cutting provider the app needs, in one place: render errors
 * (ErrorBoundary), routing, server-state caching (TanStack Query), and the
 * design system's tooltip/toast hosts. `App.tsx` only renders <AppRoutes/>
 * inside this.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <RealtimeSync />
            {children}
            <Toaster />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
