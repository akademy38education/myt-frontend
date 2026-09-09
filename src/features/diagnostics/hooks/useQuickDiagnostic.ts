import { useMutation, useQuery } from "@tanstack/react-query";
import { diagnosticsService } from "../services/diagnosticsService";

export function useQuickDiagnosticQuestions() {
  return useQuery({ queryKey: ["diagnostics", "quick"], queryFn: () => diagnosticsService.getQuickDiagnostic() });
}

export function useSubmitQuickDiagnostic() {
  return useMutation({ mutationFn: (answers: Record<string, string>) => diagnosticsService.submitQuickDiagnostic(answers) });
}
