import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { homeworkService } from "../services/homeworkService";

export function useHomeworkList(studentId: string) {
  return useQuery({
    queryKey: ["homework", studentId],
    queryFn: () => homeworkService.list(studentId),
    enabled: Boolean(studentId),
  });
}

export function useHomeworkDetail(homeworkId: string) {
  return useQuery({
    queryKey: ["homework", "detail", homeworkId],
    queryFn: () => homeworkService.getById(homeworkId),
    enabled: Boolean(homeworkId),
  });
}

export function useSaveAnswer(homeworkId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) => homeworkService.saveAnswer(homeworkId, questionId, answer),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homework"] }),
  });
}

export function useSubmitHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (homeworkId: string) => homeworkService.submit(homeworkId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homework"] }),
  });
}

export function useTutorHomework(tutorId: string) {
  return useQuery({
    queryKey: ["homework", "tutor", tutorId],
    queryFn: () => homeworkService.listForTutor(tutorId),
    enabled: Boolean(tutorId),
  });
}

export function useReviewHomework() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ homeworkId, feedback }: { homeworkId: string; feedback: string }) => homeworkService.review(homeworkId, feedback),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homework"] }),
  });
}
