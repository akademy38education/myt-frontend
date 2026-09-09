import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordInput } from "@myt/shared";
import { authService } from "../services/authService";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authService.forgotPassword(input),
  });
}
