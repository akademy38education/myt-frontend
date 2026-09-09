import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TutorStudentNote } from "@myt/shared";
import { tutorStudentsService } from "../services/tutorStudentsService";

export function useTutorStudents(tutorId: string) {
  return useQuery({
    queryKey: ["tutor-students", tutorId],
    queryFn: () => tutorStudentsService.list(tutorId),
    enabled: Boolean(tutorId),
  });
}

export function useTutorStudentDetail(tutorId: string, studentId: string) {
  return useQuery({
    queryKey: ["tutor-students", tutorId, studentId],
    queryFn: () => tutorStudentsService.getDetail(tutorId, studentId),
    enabled: Boolean(tutorId) && Boolean(studentId),
  });
}

export function useTutorStudentNotes(tutorId: string, studentId: string) {
  return useQuery({
    queryKey: ["tutor-students", tutorId, studentId, "notes"],
    queryFn: () => tutorStudentsService.getNotes(tutorId, studentId),
    enabled: Boolean(tutorId) && Boolean(studentId),
  });
}

export function useAddTutorStudentNote(tutorId: string, studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => tutorStudentsService.addNote(tutorId, studentId, body),
    onSuccess: (note) => {
      queryClient.setQueryData(["tutor-students", tutorId, studentId, "notes"], (current: TutorStudentNote[] | undefined) => (current ? [note, ...current] : [note]));
    },
  });
}
