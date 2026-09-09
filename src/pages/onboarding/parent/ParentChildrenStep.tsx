import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useParentOnboardingStore } from "@/features/onboarding/parent/store";
import { useAddChild } from "@/features/parents";
import { YEAR_GROUPS, CURRICULA, COUNTRIES } from "@/constants/tutoring";
import { parentStepPath } from "./steps";

const childSchema = z.object({
  fullName: z.string().min(2, "Enter your child's name"),
  dateOfBirth: z.string().optional(),
  yearGroup: z.string().min(1, "Select a year group"),
  schoolName: z.string().optional(),
  curriculum: z.string().optional(),
  country: z.string().optional(),
});
const formSchema = z.object({ children: z.array(childSchema).min(1) });
type FormInput = z.infer<typeof formSchema>;

export function ParentChildrenStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { children, setChildren, setSavedChildren } = useParentOnboardingStore();
  const addChild = useAddChild();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: { children: children.map(({ savedId: _savedId, ...rest }) => rest) },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "children" });

  const onSubmit = handleSubmit(async (values) => {
    if (!user) return;
    try {
      const saved = [];
      for (const child of values.children) {
        const created = await addChild.mutateAsync({
          parentUserId: user.id,
          input: { ...child, subjects: [], learningGoals: [] },
        });
        saved.push(created);
      }
      setChildren(values.children.map((child) => ({ ...child, subjects: [], learningGoals: [] })));
      setSavedChildren(saved);
      navigate(parentStepPath("goals"));
    } catch {
      toast.error("We couldn't save your children's details. Please try again.");
    }
  });

  return (
    <OnboardingStepCard title="Tell us about your children" description="Add every child you'd like to find a tutor for — you can add more later.">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {fields.map((field, index) => (
          <Card key={field.id} className="border-dashed">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">Child {index + 1}</p>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label={`Remove child ${index + 1}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`children.${index}.fullName`}>Child's name</Label>
                  <Input id={`children.${index}.fullName`} {...register(`children.${index}.fullName`)} aria-invalid={Boolean(errors.children?.[index]?.fullName)} />
                  {errors.children?.[index]?.fullName && <p className="text-sm text-destructive">{errors.children[index]?.fullName?.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`children.${index}.dateOfBirth`}>Date of birth</Label>
                  <Input id={`children.${index}.dateOfBirth`} type="date" {...register(`children.${index}.dateOfBirth`)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Year / Grade</Label>
                  <Controller
                    control={control}
                    name={`children.${index}.yearGroup`}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value} onValueChange={selectField.onChange}>
                        <SelectTrigger aria-invalid={Boolean(errors.children?.[index]?.yearGroup)}>
                          <SelectValue placeholder="Select year group" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEAR_GROUPS.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.children?.[index]?.yearGroup && <p className="text-sm text-destructive">{errors.children[index]?.yearGroup?.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`children.${index}.schoolName`}>School</Label>
                  <Input id={`children.${index}.schoolName`} {...register(`children.${index}.schoolName`)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Curriculum</Label>
                  <Controller
                    control={control}
                    name={`children.${index}.curriculum`}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value} onValueChange={selectField.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select curriculum" />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRICULA.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Controller
                    control={control}
                    name={`children.${index}.country`}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value ?? "United Kingdom"} onValueChange={selectField.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ fullName: "", yearGroup: "", dateOfBirth: "", schoolName: "", curriculum: "", country: "United Kingdom" })}
        >
          <Plus className="h-4 w-4" />
          Add another child
        </Button>

        <OnboardingStepFooter onBack={() => navigate(parentStepPath("account"))} isLoading={isSubmitting || addChild.isPending} />
      </form>
    </OnboardingStepCard>
  );
}
