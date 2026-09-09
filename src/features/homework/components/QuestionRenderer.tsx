import { QuestionType, type Question } from "@myt/shared";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** Renders the right input for a question's type — reused by homework and (later) exam mode. */
export function QuestionRenderer({ question, value, onChange, disabled }: QuestionRendererProps) {
  switch (question.type) {
    case QuestionType.MULTIPLE_CHOICE:
      return (
        <RadioGroup value={value} onValueChange={onChange} className="grid gap-2 sm:grid-cols-2">
          {question.choices?.map((choice) => (
            <label
              key={choice}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <RadioGroupItem value={choice} disabled={disabled} />
              {choice}
            </label>
          ))}
        </RadioGroup>
      );

    case QuestionType.TRUE_FALSE:
      return (
        <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-2 sm:w-64">
          {["True", "False"].map((choice) => (
            <label
              key={choice}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <RadioGroupItem value={choice} disabled={disabled} />
              {choice}
            </label>
          ))}
        </RadioGroup>
      );

    case QuestionType.LONG_ANSWER:
      return (
        <div className="space-y-1.5">
          <Label htmlFor={`q-${question.id}`} className="sr-only">
            Your answer
          </Label>
          <Textarea id={`q-${question.id}`} rows={6} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder="Write your answer..." />
        </div>
      );

    case QuestionType.NUMERIC:
      return (
        <Input type="number" className="max-w-[12rem]" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder="Your answer" />
      );

    case QuestionType.SHORT_ANSWER:
    case QuestionType.MATCHING:
    default:
      return <Input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder="Your answer" />;
  }
}
