import { useMutation } from "@tanstack/react-query";
import type { LoginInput } from "@myt/shared";
import { authService } from "../services/authService";
import { useAuthStore } from "@/stores/authStore";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (session) => {
      setSession({ user: session.user, accessToken: session.tokens.accessToken, refreshToken: session.tokens.refreshToken });
    },
  });
}
