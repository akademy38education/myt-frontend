import { useMutation } from "@tanstack/react-query";
import type { RegisterInput } from "@myt/shared";
import { authService } from "../services/authService";
import { useAuthStore } from "@/stores/authStore";

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onSuccess: (session) => {
      setSession({ user: session.user, accessToken: session.tokens.accessToken, refreshToken: session.tokens.refreshToken });
    },
  });
}
