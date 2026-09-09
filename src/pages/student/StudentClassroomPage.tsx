import { useParams } from "react-router-dom";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { ClassroomShell } from "@/features/classroom";

export function StudentClassroomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <NotFoundState />;
  return <ClassroomShell bookingId={id} role="student" />;
}
