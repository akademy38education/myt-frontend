import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoadingState } from "@/components/shared/LoadingState";
import { NotFoundState } from "@/components/shared/NotFoundState";
import { tutorsService, TutorProfileError } from "@/features/tutors";
import { BookingWizard } from "@/features/bookings";
import { useCurrentParentProfile, useChildren } from "@/features/parents";
import { initials } from "@/utils/formatters";

/** Reuses the exact same `BookingWizard` the student flow uses — the only Phase-9-specific addition is this "Select Child" step in front of it (spec §31), since a parent must explicitly say which child a lesson is for. */
export function ParentBookTutorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading: isChildrenLoading } = useChildren(parentId);
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(searchParams.get("childId") ?? undefined);

  const {
    data: tutor,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tutors", id],
    queryFn: () => tutorsService.getById(id!),
    enabled: Boolean(id),
  });

  if (isLoading || isChildrenLoading) return <LoadingState label="Loading..." />;
  if (isError) return <TutorProfileError onRetry={() => refetch()} />;
  if (!tutor) return <NotFoundState />;

  const selectedChild = children?.find((c) => c.id === selectedChildId);
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const initialSlot = date && time ? { date, time } : undefined;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card>
        <CardContent className="p-6">
          {!selectedChild ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Who is this lesson for?</h3>
                <p className="text-sm text-muted-foreground">Booking with {tutor.headline}</p>
              </div>
              {!children || children.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You don't have any children added yet.{" "}
                  <button className="text-primary hover:underline" onClick={() => navigate("/parent/children")}>
                    Add a child first →
                  </button>
                </p>
              ) : (
                <div className="space-y-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-left hover:bg-muted/50"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials(child.fullName ?? "Student")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{child.fullName}</p>
                        <p className="text-xs text-muted-foreground">{child.yearGroup}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <BookingWizard
              tutor={tutor}
              bookingForChildId={selectedChild.id}
              initialSlot={initialSlot}
              onComplete={(booking) => navigate(`/parent/bookings/${booking.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
