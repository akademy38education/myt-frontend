import { useMutation } from "@tanstack/react-query";
import type { ResetPasswordInput } from "@myt/shared";
import { authService } from "../services/authService";

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authService.resetPassword(input),
  });
}
