import { Link } from "react-router-dom";
import type { TutorProfile } from "@myt/shared";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { SelectedSlot } from "@/features/tutor-availability";
import { BookingWizard } from "./BookingWizard";

export interface BookingDialogProps {
  tutor: TutorProfile | null;
  onOpenChange: (open: boolean) => void;
  /** Pre-fills the date/time when the caller already picked a slot (e.g. from the tutor profile's Availability tab), skipping straight to duration/lesson-type. */
  initialSlot?: SelectedSlot;
}

/** The quick-book modal used from marketplace/profile contexts — see `pages/tutors/BookTutorPage.tsx` for the equivalent full-page flow at `/student/tutors/:id/book`. Both render the same `BookingWizard`. */
export function BookingDialog({ tutor, onOpenChange, initialSlot }: BookingDialogProps) {
  const { isAuthenticated } = useAuth();

  if (!tutor) return null;

  return (
    <Dialog open={Boolean(tutor)} onOpenChange={onOpenChange}>
      <DialogContent>
        {!isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle>Sign in to book a lesson</DialogTitle>
              <DialogDescription>Create a free account or sign in to book with {tutor.headline}.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/select-role">Create account</Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <BookingWizard key={tutor.id} tutor={tutor} initialSlot={initialSlot} />
        )}
      </DialogContent>
    </Dialog>
  );
}
