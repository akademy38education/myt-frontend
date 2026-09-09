import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}
