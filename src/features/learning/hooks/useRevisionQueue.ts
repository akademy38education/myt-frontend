import { useQuery } from "@tanstack/react-query";
import { learningService } from "../services/learningService";

export function useRevisionQueue() {
  return useQuery({ queryKey: ["learning", "revision"], queryFn: () => learningService.getRevisionQueue() });
}
