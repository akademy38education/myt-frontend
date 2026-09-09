import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentParentProfile, useChildren, useAddChild } from "@/features/parents";
import { SUBJECTS } from "@/constants/subjects";
import { initials } from "@/utils/formatters";

export function ParentChildrenPage() {
  const { user } = useAuth();
  const { parentId } = useCurrentParentProfile();
  const { data: children, isLoading, isError, refetch } = useChildren(parentId);
  const addChild = useAddChild();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [subjects, setSubjects] = useState("");
  const [learningGoals, setLearningGoals] = useState("");

  function resetForm() {
    setFullName("");
    setYearGroup("");
    setSubjects("");
    setLearningGoals("");
  }

  function handleAddChild() {
    if (!user || !fullName.trim() || !yearGroup.trim()) return;
    addChild.mutate(
      {
        parentUserId: user.id,
        input: {
          fullName: fullName.trim(),
          yearGroup: yearGroup.trim(),
          subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
          learningGoals: learningGoals.split(",").map((s) => s.trim()).filter(Boolean),
        },
      },
      {
        onSuccess: () => {
          toast.success(`${fullName.trim()} has been added to your family`);
          setOpen(false);
          resetForm();
        },
        onError: () => toast.error("Couldn't add your child — please try again"),
      }
    );
  }

  if (!parentId || isLoading) return <LoadingState label="Loading your family..." />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader
        title="Children"
        description="Manage the children on your MyT account."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Child
          </Button>
        }
      />

      {!children || children.length === 0 ? (
        <EmptyState icon={Users} title="No children added yet" description="Add a child to start booking lessons and tracking their progress." actionLabel="Add Child" onAction={() => setOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Card key={child.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback>{initials(child.fullName ?? "Student")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{child.fullName}</p>
                    <p className="text-xs text-muted-foreground">{child.yearGroup}</p>
                  </div>
                  <Badge variant={child.userId ? "success" : "muted"} className="ml-auto">
                    {child.userId ? "Active" : "Pending setup"}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {child.subjects.map((id) => (
                    <Badge key={id} variant="outline">
                      {SUBJECTS.find((s) => s.id === id)?.name ?? id}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                  <Link to={`/parent/children/${child.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a child</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="child-name">Full name</Label>
              <Input id="child-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="child-year">Year group</Label>
              <Input id="child-year" value={yearGroup} onChange={(e) => setYearGroup(e.target.value)} placeholder="e.g. Year 8" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="child-subjects">Subjects (comma-separated ids)</Label>
              <Input id="child-subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder="subject-maths, subject-english" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="child-goals">Learning goals (comma-separated)</Label>
              <Input id="child-goals" value={learningGoals} onChange={(e) => setLearningGoals(e.target.value)} className="mt-1.5" />
            </div>
            <Button className="w-full" onClick={handleAddChild} disabled={!fullName.trim() || !yearGroup.trim() || addChild.isPending}>
              Add Child
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
