import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBJECTS } from "@/constants/subjects";
import { useAuth } from "@/hooks/useAuth";
import { useCreateGoal } from "../hooks/useGoals";

const schema = z.object({
  title: z.string().min(5, "Tell us a bit more about your goal"),
  subjectId: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  targetDate: z.string().min(1, "Pick a target date"),
});
type FormInput = z.infer<typeof schema>;

export function CreateGoalDialog({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const createGoal = useCreateGoal();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema), defaultValues: { priority: "medium" } });

  const onSubmit = handleSubmit(async (values) => {
    await createGoal.mutateAsync({ studentId: studentId || user?.id || "", ...values });
    toast.success("Goal created");
    reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set a new goal</DialogTitle>
          <DialogDescription>What do you want to achieve?</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Your goal</Label>
            <Input id="title" placeholder="e.g. Reach grade 7 in my Maths mock exam" {...register("title")} aria-invalid={Boolean(errors.title)} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Subject (optional)</Label>
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="No specific subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="targetDate">Target date</Label>
            <Input id="targetDate" type="date" {...register("targetDate")} aria-invalid={Boolean(errors.targetDate)} />
            {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-3 gap-2">
                  {["low", "medium", "high"].map((p) => (
                    <label key={p} className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border p-2 text-sm capitalize has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <RadioGroupItem value={p} />
                      {p}
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit" isLoading={createGoal.isPending}>
              Create goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
