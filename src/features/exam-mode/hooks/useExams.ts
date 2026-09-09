import { useQuery } from "@tanstack/react-query";
import { examService } from "../services/examService";

export function useExams() {
  return useQuery({ queryKey: ["exams"], queryFn: () => examService.list() });
}
