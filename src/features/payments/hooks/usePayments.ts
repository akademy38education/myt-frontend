import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AddPaymentMethodInput } from "@myt/shared";
import { paymentsService } from "../services/paymentsService";
import type { PaymentFilter } from "../types";

export function usePaymentSummary(parentId: string) {
  return useQuery({
    queryKey: ["payments", parentId, "summary"],
    queryFn: () => paymentsService.getSummary(parentId),
    enabled: Boolean(parentId),
  });
}

export function usePaymentsList(parentId: string, filter: PaymentFilter = {}) {
  return useQuery({
    queryKey: ["payments", parentId, "list", filter],
    queryFn: () => paymentsService.list(parentId, filter),
    enabled: Boolean(parentId),
  });
}

export function usePaymentMethods(parentId: string) {
  return useQuery({
    queryKey: ["payments", parentId, "methods"],
    queryFn: () => paymentsService.listMethods(parentId),
    enabled: Boolean(parentId),
  });
}

export function useAddPaymentMethod(parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AddPaymentMethodInput) => paymentsService.addMethod(parentId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments", parentId, "methods"] }),
  });
}

export function useRemovePaymentMethod(parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (methodId: string) => paymentsService.removeMethod(parentId, methodId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments", parentId, "methods"] }),
  });
}

export function useSetDefaultPaymentMethod(parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (methodId: string) => paymentsService.setDefaultMethod(parentId, methodId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["payments", parentId, "methods"] }),
  });
}
