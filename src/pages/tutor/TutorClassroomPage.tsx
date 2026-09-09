import { useParams } from "react-router-dom";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { ClassroomShell } from "@/features/classroom";

export function TutorClassroomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <NotFoundState />;
  return <ClassroomShell bookingId={id} role="tutor" />;
}
